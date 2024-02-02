import React, { useContext, useState } from "react";
import {Link,Navigate} from "react-router-dom"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import tw from "twin.macro";
import axios from "axios";
import { UserContext } from "../UserContext";


function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const {data} = await axios.post('/adminlogin', {email,password});
      setUser(data)
      alert('Login successful');
      setRedirect(true);
      
    } catch (e) {
      alert('Login failed');
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <PageContainer>
      
      <Container>
      

      <FormContainer>
        <h3>Login</h3>

        <InputContainer>
          <p>Name</p>
          <input
            type="text"
            placeholder="Username"
            onChange={(ev) => setEmail(ev.target.value)}
            value={email}
          />
        </InputContainer>
        <InputContainer>
          <p>Password</p>
          <input
            type="password"
            placeholder="********"
            onChange={(ev) => setPassword(ev.target.value)}
            value={password}
          />
        </InputContainer>

        <LoginButton onClick={handleLoginSubmit} >Login</LoginButton>
        
        
      </FormContainer>
      
      </Container>
    </PageContainer>
  );
}

const Container = styled.div`
  width: 40%;
  min-width: 450px;
  height: fit-content;
  padding: 15px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 80%;
    min-width: unset;
  }
`;



const PageContainer = styled.div`

  ${tw`
  flex
  flex-col
  w-full
  h-full
  items-center
  overflow-x-hidden
  
  `}
  
`;
const FormContainer = styled.form`
  border: 1px solid lightgray;
  width: 55%;
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;

  h3 {
    font-size: 28px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;

    margin-bottom: 10px;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 10px;

  p {
    font-size: 14px;
    font-weight: 600;
  }

  input {
    width: 95%;
    height: 33px;
    padding-left: 5px;
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;

    &:hover {
      border: 1px solid orange;
    }
  }
`;

const LoginButton = styled.button`
  width: 70%;
  height: 75px;
  background-color: #fd3b2b;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-top: 20px;
`;

const InfoText = styled.p`
  font-size: 12px;
  width: 100%;
  word-wrap: normal;
  word-break: normal;
  margin-top: 20px;

  span {
    color: #426bc0;
    cursor: pointer;
  }
`;

const SignUpButton = styled.button`
  width: 55%;
  height: 35px;
  font-size: 12px;
  margin-top: 20px;

  &:hover {
    background-color: #dfdfdf;
    border: 1px solid gray;
  }
`;
export default AdminLogin;
