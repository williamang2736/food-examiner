import React, { Component } from "react";
import FoodRecognitionForm from "./FoodRecognitionForm";
import FoodRecognitionContent from "./FoodRecognitionContent";
import { toast } from "react-toastify";
import axios from "axios";

export default class FoodRecognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc:
        "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
      predictions: [
        {
          name: "blueberries",
          value: 0.9
        },
        {
          name: "waffle",
          value: 0.85
        },
        {
          name: "cake",
          value: 0.75
        },
        {
          name: 'oil',
          value: 0.65
        },
        {
          name: 'steak',
          value: 0.4
        }
      ],
      predictionsPending: false,
      imageLink: "",
      stage: 3,
      googleRecaptchaValue: null,
      imageLinkFieldError: null
    };
  }

  render() {
    return (
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <FoodRecognitionForm
          value={this.state.imageLink}
          onFormSubmit={this._onFormSubmit}
          onInputFieldUpdated={this._onImageLinkFieldUpdated}
          predictionsPending={this.state.predictionsPending}
          stage={this.state.stage}
          onProvideNewImageButtonClicked={this._onProvideNewImageButtonClicked}
          onReCaptchaCompleted={this._onReCaptchaCompleted}
          imageLinkFieldError={this.state.imageLinkFieldError}
        />
        <FoodRecognitionContent
          imageSrc={this.state.imageSrc}
          predictions={this.state.predictions}
          predictionsPending={this.state.predictionsPending}
        />
      </div>
    );
  }

  _onImageLinkFieldUpdated = e => {
    this.setState({ imageLink: e.target.value, imageLinkFieldError: null });
  };

  _onFormSubmit = async e => {
    e.preventDefault();

    if (!this.state.imageLink) {
      this.setState({ imageLinkFieldError: "Please provide an image link" });
      return;
    }

    try {
      this.setState({
        imageSrc: this.state.imageLink,
        predictionsPending: true
      });

      const url = "http://localhost:3001/foodImageRecognition/";
      const response = await axios.post(url, {
        imageLink: this.state.imageLink,
        googleRecaptchaValue: this.state.googleRecaptchaValue
      });

      const predictions = response.data.outputs[0].data.concepts;
      this.setState({ predictions, predictionsPending: false, stage: 1 });
    } catch (err) {
      toast.error(err.response.data.err);
      this.setState({ predictionsPending: false, stage: 1 });
    }
  };

  _onProvideNewImageButtonClicked = () => {
    this.setState({
      stage: 2
    });
  };

  _onReCaptchaCompleted = value => {
    this.setState({
      stage: 3,
      googleRecaptchaValue: value
    });
  };
}
