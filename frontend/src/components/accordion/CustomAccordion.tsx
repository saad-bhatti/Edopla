import React from "react";
import { Accordion, Button, ListGroup } from "react-bootstrap";
import styleUtils from "../../styles/utils.module.css";

interface CustomAccordionProps {
  headerText: string;
  listGroupText: string[];
  listGroupValues: string[];
  buttonText: string;
  onButtonClicked: () => void;
  className?: string;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  headerText,
  listGroupText,
  listGroupValues,
  buttonText,
  onButtonClicked,
  className,
}: CustomAccordionProps) => {
  return (
    <Accordion className={className} defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <h5 style={{ marginBottom: "0px" }}>{headerText}</h5>
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup variant="flush">
            {listGroupText.map((text, index) => (
              <ListGroup.Item key={index}>
                <div className="fw-bold">{text}</div>
                {listGroupValues[index]}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button
            className={styleUtils.width100}
            onClick={(event) => {
              onButtonClicked();
              event.stopPropagation();
            }}
          >
            {buttonText}
          </Button>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CustomAccordion;
