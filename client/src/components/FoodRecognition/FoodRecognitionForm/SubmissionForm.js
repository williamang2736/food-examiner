import React, { Component } from "react";
import Spinner from "react-spinkit";
import { connect } from "react-redux";

import ImageSelectorModal from "../ImageSelectorModal/ImageSelectorModal";
import {
  updateImageLinkInput,
  submitFoodRecognitionForm,
  foodRecognitionGetRandomImage
} from "../../../actions/foodRecognitionFormActions";
import { imageGalleryToggleModal } from "../../../actions/imageGalleryActions";

class SubmissionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  render() {
    return (
      <form
        className="d-flex justify-content-between flex-wrap"
        onSubmit={this._submitForm}
      >
        {this._renderImageLinkInputField()}
        {this._renderSetRandomImageButton()}
        {this._renderSelectFromGalleryButton()}
        {this._renderSubmitButton()}
        <ImageSelectorModal />
      </form>
    );
  }

  _submitForm = e => {
    e.preventDefault();
    this.props.submitFoodRecognitionForm(this.props.imageLinkInputValue, this.props.googleRecaptchaValue);
  };

  _renderImageLinkInputField = () => {
    const invalidFeedbackStyle = {
      position: "absolute",
      display: this.props.imageLinkFieldError ? "block" : "none"
    };
    const inputClassName = this.props.imageLinkFieldError
      ? "form-control is-invalid"
      : "form-control";
    return (
      <div style={{ flexBasis: "100%", marginBottom: "10px" }}>
        <input
          type="text"
          value={this.props.imageLinkInputValue}
          className={inputClassName}
          style={{ position: "relative" }}
          placeholder="Provide a direct link to a file on the web"
          onChange={e => this.props.updateImageLinkInput(e.target.value)}
        />
        <div className="invalid-feedback" style={invalidFeedbackStyle}>
          {this.props.imageLinkFieldError}
        </div>
      </div>
    );
  };

  _renderSelectFromGalleryButton = () => {
    return this._renderButton({
      text: "Select from gallery",
      onClick: this.props.toggleModal,
      additionalClassName: "btn-success"
    });
  };

  _renderSetRandomImageButton = () => {
    return this._renderButton({
      text: "Get a random food image",
      pending: this.props.getRandomImagePending,
      onClick: this.props.getRandomImage,
      additionalClassName: "btn-success"
    });
  };

  _renderSubmitButton = () => {
    return this._renderButton({
      text: "Submit",
      pending: this.props.predictionsPending,
      type: "submit"
    });
  };

  _renderButton = ({
    text = "Button",
    onClick = () => {},
    pending = false,
    type = "button",
    additionalClassName = ""
  }) => {
    let buttonClass = `btn btn-primary d-flex justify-content-center ${additionalClassName}`;
    const buttonContent = pending ? this._renderButtonSpinner() : text;
    return (
      <button
        className={buttonClass}
        type={type}
        disabled={pending}
        onClick={onClick}
        style={{ flexBasis: "33%" }}
      >
        {buttonContent}
      </button>
    );
  };

  _renderButtonSpinner = () => {
    return (
      <Spinner
        name="three-bounce"
        className="spinner-small"
        color="white"
        fadeIn="none"
      />
    );
  };
}

const mapStateToProps = state => ({
  ...state.foodRecognition
});

export default connect(
  mapStateToProps,
  {
    updateImageLinkInput,
    submitFoodRecognitionForm,
    getRandomImage: foodRecognitionGetRandomImage,
    toggleModal: imageGalleryToggleModal
  }
)(SubmissionForm);
