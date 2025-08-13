import styled from "styled-components/native";

export const StyledMainContainer = styled.View`
  width: 100%;
  align-self: center;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
  background-color: #fff;
`;

export const StatusContainer = styled.View<{ backgroundColor: string }>`
  gap: 3px;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  align-self: flex-start; 
  padding: 5px 10px 5px 10px;
  background-color: ${(props) => props.backgroundColor};
`;

