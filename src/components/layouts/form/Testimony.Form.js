// React
import { Component } from "react";

// Components
import DashboardForm from "@layouts/dashboard/common/Dashboard.Form"
import TestimonyFormFields from "@layouts/dashboard/testimony/Testimony.FormFields"

export default class TestimonyForm extends Component {
  static defaultProps = {
    defaultValues: {
      author: "",
      age: "",
      country: "",
      testimony: "",
      authorPhoto: null,
    },
    uploadImage: {
      position: 'top',
      field: "authorPhoto"
    },
  };

  constructor(props) {
    super(props);
    this.validationSchema = {
      author: {
        required: "Por favor ingresa el nombre del autor",
        min: 2
      },
      age: {
        min: {
          limit: 2,
          message: "Es recomendable que la persona sea mayor de edad"
        },
        max: {
          limit: 3,
          message: "Ingresa una edad válida"
        }
      },
      country: {
        required: "Por favor ingresa el ciudad o país de residencia del autor",
        max: {
          limit: 50,
          message: "El nombre de la ciudad o del país es muy largo"
        }
      },
      testimony: {
        required: "Por favor ingresa el testimonio del autor",
        min: {
          limit: 500,
          message: "El testimonio es muy corto" 
        },
        max: {
          limit: 5000,
          message: "El testimonio es muy largo"
        }
      },
    }
  }

  render() {
    return (
      <DashboardForm
        onSubmit={this.props.onSubmit}
        uploadImage={this.props.uploadImage}
        defaultValues={this.props.defaultValues}
        validationSchema={this.validationSchema}
        saveButtonTitle={this.props.saveButtonTitle}
      >
        {(formData) => <TestimonyFormFields {...formData} />}
      </DashboardForm>
    );
  }
}
