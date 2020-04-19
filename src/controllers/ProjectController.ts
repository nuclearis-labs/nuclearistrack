import Contract from '../classes/Contract';
import * as utils from '../config/utils';
import * as pending from '../config/pendingTx';
import UserModel from '../models/user';
import logger from '../config/winston';
import { Request, Response } from 'express';
import { IUserOnReq } from '../types/Custom';
import txModel from '../models/transaction';

async function getUserNameByAddress(address: any) {
  const { username } = await UserModel.findOne({ address });
  return username;
}

export async function create(req: IUserOnReq, res: Response) {
  try {
    const { address, privateKey } = await utils.getKeys({
      email: req.user.userEmail,
      passphrase: req.body.passphrase
    });
    const nuclear = new Contract({ privateKey });

    const oc = utils.asciiToHex(req.body.oc);
    const projectTitle = utils.asciiToHex(req.body.proyectoTitle);

    const txHash = await nuclear.sendDataToContract({
      fromAddress: address,
      method: 'createProject',
      data: [req.body.expediente, req.body.clientAddress, projectTitle, oc]
    });

    await pending.create({
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
  } catch (error) {
    logger.error(`Project ${req.body.expediente} was not created`);
    res.status(400).json(error.message);
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

export async function get(req: IUserOnReq, res: Response) {
  try {
    const query =
      process.env.ADMINEMAIL === req.user.userEmail
        ? { method: 'getAllProjects' }
        : { method: 'getProjectsByAddress', data: [req.user.address] };

    const contract = new Contract();
    const contractProjects = await contract.getDataFromContract(query);

    await txModel.deleteMany({ data: { $in: contractProjects } });
    const pendingProjects = await txModel.aggregate([
      {
        $match: {
          subject: 'add-project'
        }
      },
      {
        $project: {
          status: '0',
          title: {
            $arrayElemAt: ['$data', 0]
          },
          clientAddress: {
            $arrayElemAt: ['$data', 1]
          },
          id: {
            $arrayElemAt: ['$data', 2]
          },
          oc: {
            $arrayElemAt: ['$data', 3]
          },
          processContracts: []
        }
      }
    ]);

    const allProjectsDetails = contractProjects.map(async (id: string) => {
      const details = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [id]
      });

      const username = await getUserNameByAddress(details[1]);

      return {
        status: details[0],
        clientAddress: details[1],
        clientName: username,
        title: utils.hexToAscii(details[2]),
        oc: utils.hexToAscii(details[3]),
        processContracts: details[4],
        id
      };
    });

    Promise.all(allProjectsDetails).then(projectDetails => {
      projectDetails.push(...pendingProjects);
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

    await pending.create({
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
