import React from "react";
import styled from "styled-components";
import { Form } from "../styles/form";
import Footer from "../components/Footer";
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
} from "../styles/webComponents";
import { Label, Input, TextArea, Button } from "../styles/components";
import I18n from "../i18n";
import bg from "../img/bgHome.jpg";
import { useForm } from "react-hook-form";
import { useAsync } from "../hooks/useAsync";
import axios from "axios";

const WebTopContact = styled(WebTop)`
  height: 370px;
  background: url(${bg}) #1a1a1a no-repeat center;
`;

export default function Contact() {
  const { register, handleSubmit, getValues, errors } = useForm();
  const { execute, pending } = useAsync(onSubmit, false);

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({ method: "post", url: "/api/contact/", data: { ...form } })
        .then(({ data }) => resolve(data))
        .catch((e) => reject(e.message));
    });
  }
  return (
    <>
      <WebTopContact>
        <WidthContent>
          <WebTopTit>
            <I18n t="contact.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopContact>
      <WidthContent style={{ textTransform: "uppercase" }}>
        <Form>
          <Label>
            <I18n t="contact.name" />
          </Label>
          <Input name="name" type="text"></Input>
          <Label>
            <I18n t="contact.email" />
          </Label>
          <Input name="email" type="email"></Input>
          <Label>
            <I18n t="contact.message" />
          </Label>
          <TextArea name="message"></TextArea>
          <Button
            type="submit"
            disabled={pending}
            onClick={handleSubmit(execute)}
          >
            <I18n t="contact.submit" />
          </Button>
        </Form>
      </WidthContent>
      <BottomSpace />
      <Footer />
    </>
  );
}
