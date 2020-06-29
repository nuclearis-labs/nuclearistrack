import React, { useContext } from 'react';
import Footer from '../components/Footer';
import { Title, Label, Input, Button, Select } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { ProjectSchema } from '../validationSchemas/index';
import { DrizzleContext } from '@drizzle/react-plugin';

export default function NewProject() {
  const { drizzle, initialized } = useContext(DrizzleContext.Context);
  const { register, handleSubmit, errors } = useForm({
    validationSchema: ProjectSchema,
  });

  function submit(data) {
    console.log(data);
    if (initialized)
      drizzle.contracts.NuclearPoE.methods
        .createProject(
          data.expediente,
          data.clientAddress,
          drizzle.web3.utils.asciiToHex(data.proyectoTitle),
          drizzle.web3.utils.asciiToHex(data.oc)
        )
        .send();
  }
  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(submit)}>
          <Label>
            <I18n t="forms.projectTitle" />
          </Label>
          <Input type="text" ref={register} name="proyectoTitle"></Input>
          <ErrorForm>
            {errors.proyectoTitle && errors.proyectoTitle.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.client" />
          </Label>
          <Select name="clientAddress" defaultValue="" ref={register}>
            <option disabled hidden value="">
              Select one...
            </option>

            <option value="0x9b4453Fa524904a427D8065FD6c9b12f943EfdbA">
              NA-SA
            </option>
          </Select>
          <ErrorForm>
            {errors.clientAddress && errors.clientAddress.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.expediente" />
          </Label>
          <Input type="text" name="expediente" ref={register}></Input>
          <ErrorForm>
            {errors.expediente && errors.expediente.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.oc" />
          </Label>
          <Input ref={register} name="oc"></Input>
          <ErrorForm>{errors.oc && errors.oc.message}</ErrorForm>
          <Button type="submit">CREAR</Button>
        </Form>
      </FormWrap>

      <Footer />
    </>
  );
}
