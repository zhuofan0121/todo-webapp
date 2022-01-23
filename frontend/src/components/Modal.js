import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  handleClick = () => {
    // alert("handle click")
    var gapi = window.gapi
    var CLIENT_ID = "633288986086-83ectdb6m0lb0vqv7m4lo52qmi0ofonm.apps.googleusercontent.com"
    var API_KEY = "AIzaSyDP5QbETSg_1B5FJ_Rb7BSmSXmvgdAkPpE"
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    var SCOPES = "https://www.googleapis.com/auth/calendar.events"

    gapi.load('client:auth2', () => {
      console.log('loaded client')
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      // let duration = '00:30:00';
      // let startDate = new Date(timeString);
      // let msDuration = (Number(duration.split(':')[0]) * 60 * 60 + Number(duration.split(':')[1]) * 60  + Number(duration.split(':')[2])) * 1000;
      // let endDate = new Date(startDate.getTime() + msDuration);
      // let isoStartDate = new Date(startDate.getTime()-new Date().getTimezoneOffset()*60*1000).toISOString().split(".")[0];
      // let isoEndDate = new Date(endDate.getTime()-(new Date().getTimezoneOffset())*60*1000).toISOString().split(".")[0];

      var startTime = new Date();
      // var tomorrow = new Date(startTime.getTime() + (24 * 60 * 60 * 1000));
      var endTime = new Date(startTime.getTime() + (30 * 60 * 1000));

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        var event = {
          'summary': this.state.activeItem.title,
          'description': this.state.activeItem.description,
          'start': {
            // 'dateTime': '2022-01-23T09:00:00-07:00',
            // 'dateTime': new Date().toISOString(),
            'dateTime': startTime.toISOString(),
            // 'date': new Date('2022-01-23'),
            'timeZone': 'America/Chicago'
          },
          'end': {
            'dateTime': endTime.toISOString(),
            // 'date': new Date('2022-01-24'),
            'timeZone': 'America/Chicago'
          }
        }
        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })
        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
      })
    })
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Todo Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={this.state.activeItem.completed}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={this.handleClick}
            // onClick={() => alert('clicked')}
          >
            Add to Calendar
          </Button>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}