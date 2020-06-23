import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Title, Label, Input, Button } from "../styles/components";
import { Top, FormWrap, Form, ErrorForm } from "../styles/form";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import { loginUser } from "../actions/actionCreators";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { useAsync } from "../hooks/useAsync";
import { LoginSchema } from "../validationSchemas/index";
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
} from "../styles/webComponents";
import I18n from "../i18n";
import bg from "../img/bgHome.jpg";

const WebTopLogin = styled(WebTop)`
  height: 370px;
  background: url(${bg}) #1a1a1a no-repeat center;
`;

function Login(props: any) {
  const { register, handleSubmit, errors, setError, getValues } = useForm({
    validationSchema: LoginSchema,
  });
  const { execute, pending, value, error } = useAsync(
    async () => props.loginUser(getValues()),
    false
  );
  const history = useHistory();

  useEffect(() => {
    if (props.user !== null) history.push("/");
  }, [props.user]);

  useEffect(() => {
    if (props.error !== undefined) {
      setError("email", "wrong", "Username or Password incorrect");
      setError("passphrase", "wrong", "Username or Password incorrect");
    }
  }, [props.error]);

  return (
    <>
      <WebTopLogin>
        <WidthContent>
          <WebTopTit>
            <I18n t="login.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopLogin>
      <WidthContent style={{ textTransform: "uppercase" }}>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>
            <I18n t="login.user" />
          </Label>
          <Input name="email" ref={register} autoComplete="username" />
          <ErrorForm>{errors.email && errors.email.message}</ErrorForm>
          <Label>
            <I18n t="login.passphrase" />
          </Label>
          <Input
            name="passphrase"
            ref={register}
            autoComplete="current-password"
            type="password"
          />
          <ErrorForm>
            {errors.passphrase && errors.passphrase.message}
          </ErrorForm>
          <Button type="submit" color="white" disabled={pending}>
            {pending ? (
              <Spinner size="sm" color="primary" />
            ) : (
              <I18n t="login.submit" />
            )}
          </Button>
        </Form>
      </WidthContent>

      <BottomSpace />

      <Footer />
    </>
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user, error: reduxState.error };
}

export default connect(mapStateToProps, { loginUser })(Login);
