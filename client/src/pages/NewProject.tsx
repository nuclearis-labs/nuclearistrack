import React, { useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import {
  Title,
  Label,
  Input,
  PassphraseInput,
  Select,
  Button,
  PassphraseButton,
} from "../styles/components";
import Spinner from "../components/Spinner";
import { Top, Form, FormWrap, ErrorForm } from "../styles/form";
import I18n from "../i18n";
import useSWR from "swr";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAsync } from "../hooks/useAsync";
import { ProjectSchema } from "../validationSchemas/index";

export default function NewProject() {
  const { register, handleSubmit, errors, setError, getValues } = useForm({
    validationSchema: ProjectSchema,
  });
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  let history = useHistory();

  const { data } = useSWR("/api/user/get", (url) =>
    axios({
      url,
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((result) => result.data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "/api/project/",
        data: getValues(),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(({ data }) => resolve(data))
        .catch((e) => reject(e.response.data));
    });
  }

  useEffect(() => {
    if (error !== null) {
      for (const key in error) {
        setError(key.replace("body.", ""), "duplicate", error[key].message);
      }
    }
  }, [error]);

  useEffect(() => {
    if (value !== null) history.push("/projects");
  }, [value]);

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
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
            {data &&
              data.map((user: any) => (
                <option value={user.address} key={user.address}>
                  {user.username}
                </option>
              ))}
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
          <div style={{ marginTop: "30px" }}>
            <PassphraseInput
              type="password"
              placeholder="Ingresar clave"
              ref={register}
              name="passphrase"
            ></PassphraseInput>
            <PassphraseButton disabled={pending} type="submit">
              {pending ? <Spinner size="sm" color="white" /> : "CREAR"}
            </PassphraseButton>
            <ErrorForm>
              {errors.passphrase && errors.passphrase.message}
            </ErrorForm>
          </div>
        </Form>
      </FormWrap>

      <Footer />
    </>
  );
}
