// React
import { Component } from "react";

// Components
import DashboardForm from "@layouts/dashboard/common/Dashboard.Form"
import UserFormFields from '@layouts/dashboard/user/User.FormFields'

export default class UserForm extends Component {
  static defaultProps = {
    showFieldPassword: true,
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: null,
      profilePhoto: null,
    },
    uploadImage: {
      field: "profilePhoto",
    },
  };

  render() {
    return (
      <DashboardForm
        onSubmit={this.props.onSubmit}
        uploadImage={this.props.uploadImage}
        defaultValues={this.props.defaultValues}
        validationSchema={this.props.validationSchema}
        saveButtonTitle={this.props.saveButtonTitle}
      >
        {({ values, setFieldValue, errors, handleSubmit }) => (
          <UserFormFields
            extraData={{
              values: values,
              setFieldValue: setFieldValue,
              errors: errors,
              handleSubmit: handleSubmit,
              hideRoles: this.props.hideRoles,
              showFieldPassword: this.props.showFieldPassword,
            }}
          />
        )}
      </DashboardForm>
    );
  }
}
