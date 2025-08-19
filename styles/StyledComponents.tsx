import styled from "styled-components/native";

export const StyledMainContainer = styled.View`
  flex: 1;
  width: 100%;
  align-self: center;
  padding: 10px 5px 0 5px;
  box-sizing: border-box;
  background-color: #f7f9fb;
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

