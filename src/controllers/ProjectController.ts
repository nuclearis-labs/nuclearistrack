import Contract from '../classes/Contract';
import * as utils from '../config/utils';
import txModel from '../models/transaction';
import logger from '../config/winston';
import { Request, Response } from 'express';

export async function create(req: Request, res: Response) {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);
    const nuclear = new Contract({ privateKey });

    const oc = utils.asciiToHex(req.body.oc);
    const projectTitle = utils.asciiToHex(req.body.proyectoTitle);

    const txHash = await nuclear.sendDataToContract({
      fromAddress: address,
      method: 'createProject',
      data: [req.body.expediente, req.body.clientAddress, projectTitle, oc]
    });

    await utils.createPendingTx({
      txHash,
      subject: 'add-project',
      data: [
        req.body.proyectoTitle,
        req.body.clientAddress,
        req.body.expediente,
        req.body.oc
      ]
    });

    logger.info(`Project ${req.body.expediente} created`);

    res.json(txHash);
  } catch (e) {
    logger.error(`Project ${req.body.expediente} was not created`);
    res.status(500).json({ error: e.message });
  }
}

export async function getDocNumber(req: Request, res: Response) {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({ method: 'docNumber' });

    res.json(result);
  } catch (e) {
    logger.error(`Doc Number could not be retrieved `, { message: e.message });
    res.json({ error: e.message });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const contract = new Contract();
    const contractProjects = await contract.getDataFromContract({
      method: 'getAllProjects'
    });

    await txModel.deleteMany({ data: { $in: contractProjects } });
    const pendingProjects = await txModel.aggregate([
      {
        $match: {
          subject: 'add-project'
        }
      },
      {
        $group: {
          _id: null,
          result: { $push: { $arrayElemAt: ['$data', 2] } }
        }
      }
    ]);

    const allProjects = Object.values(contractProjects).concat(
      pendingProjects.length > 0 ? pendingProjects[0]['result'] : []
    );

    const allProjectsDetails = allProjects.map(async (id: string) => {
      const details = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [id]
      });
      if (
        details[1] === req.user.address ||
        req.user.address === process.env.ADMINADDRESS
      )
        return {
          status: details[0],
          clientAddress: details[1],
          clientName: utils.hexToAscii(details[2]),
          title: utils.hexToAscii(details[3]),
          oc: utils.hexToAscii(details[4]),
          processContracts: details[5],
          id
        };
      return {};
    });

    Promise.all(allProjectsDetails).then(projectDetails => {
      res.json(projectDetails);
    });
  } catch (e) {
    logger.error(`ProjectList could not be obtained `, { message: e.message });

    res.status(500).json({ error: e.message });
  }
}

export async function close(req: Request, res: Response) {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'changeProjectStatus',
      data: [req.params.expediente]
    });
    logger.info(`Project ${req.params.expediente} closed`);

    res.json(txHash);
  } catch (e) {
    logger.error(`Project could not be closed `, { message: e.message });
    res.status(400).json({ error: e.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({
      method: 'getProjectDetails',
      data: [req.query.expediente]
    });

    res.json({
      active: result[0],
      clientName: utils.hexToAscii(result[2]),
      clientAddress: result[1],
      expediente: req.query.expediente,
      title: utils.hexToAscii(result[3]),
      oc: utils.hexToAscii(result[4]),
      processContracts: result[5]
    });
  } catch (e) {
    logger.error(`Project ${req.query.expediente} could not be obtained `, {
      message: e.message
    });
    res.json({ error: e.message });
  }
}

export async function assignProcess(req: Request, res: Response) {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);
    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'addProcessToProject',
      data: [Number(req.body.expediente), req.body.processContract]
    });

    await utils.createPendingTx({
      txHash,
      subject: 'assign-process',
      data: [req.body.expediente, req.body.processContract]
    });
    logger.info(
      `Process ${req.body.processContract} was assigned to project ${req.body.expediente} `
    );

    res.json(txHash);
  } catch (e) {
    logger.error(
      `Process ${req.body.processContract} could not be assigned to project ${req.body.expediente} `,
      { message: e.message }
    );

    res.json({ error: e.message });
  }
}
