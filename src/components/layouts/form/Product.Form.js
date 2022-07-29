// React
import { Component } from "react";

// Components
import { Form } from "@common";
import Wrapper from "@layouts/dashboard/common/Dashboard.Wrapper";
import { SaveButton } from "@layouts/dashboard/common/Dashboard.Form";
import ProductFormFields from "@layouts/dashboard/product/Product.FormFields";
import ProductMultipleImages from "@layouts/dashboard/product/Product.MultipleImages";

// Utils
import { updateArrayItem, removeArrayItem } from "@utils/Helper";

export default class ProductForm extends Component {
  static defaultProps = {
    defaultValues: {
      name: "",
      price: "",
      description: "",
      content: "",
      stock: 0,
      images: [],
      benefits: [],
      categories: [],
      usageMode: "",
    },
  };

  constructor(props) {
    super(props);
    this.mq = window.innerWidth <= 480;
    this.setImages = this.setImages.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.formAttributes = {
      style: {
        width: "100%",
        padding: this.mq ? "1em 0px 1.5em" : "2em 1.75em 2.5em",
        ...this.props.style,
      },
      encType: "multipart/form-data",
    };

    this.validationSchema = {
      images: {
        required: "Por favor añade una o más imágenes del producto",
      },
      name: {
        required: "Por favor ingresa el nombre del producto",
        min: 3,
        max: 36,
      },
      description: {
        required: "Por favor ingresa la descripción del producto",
        min: {
          limit: 50,
          message: "La descripción es muy corta",
        },
        max: {
          limit: 350,
          message: "La descripción es muy larga",
        },
      },
      content: {
        required: "Por favor ingresa el contenido del producto",
        min: {
          limit: 25,
          message: "El contenido del producto es muy corta",
        },
        max: {
          limit: 100,
          message: "El contenido del producto es muy largo",
        },
      },
      benefits: {
        required: "Por favor añade los beneficios del producto",
        max: {
          message: "Has sobrepasado el límite de 12 beneficios por producto",
          limit: 12
        },
        min: {
          limit: 5,
          message: "Por favor añade al menos 5 beneficios del producto",
        }
      },
      categories: {
        required: "Por favor selecciona una categoría",
      },
      usageMode: {
        required: "Por favor describe cuál es el modo de empleo del producto",
        min: 50,
        max: 500,
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.defaultValues !== nextProps.defaultValues;
  }

  // Setear imagen a formulario
  setImages(newImages, formData) {
    formData.setFieldValue('images', [...formData.values.images, ...newImages]);
  }

  // Actualizar imagen del formulario
  updateImage(updatedImage, formData) {
    const images = updateArrayItem(formData.values.images, {
      newData: updatedImage,
      filter: { _id: updatedImage._id },
    })

    formData.setFieldValue("images", images);
  }

  // Eliminar imagen de valores del formulario
  deleteImage(imageId, formData) {
    const images = removeArrayItem(formData.values.images, {
      _id: imageId
    });

    formData.setFieldValue('images', images)
  }

  render() {
    return (
      <Wrapper className="position-relative">
        <Form
          onSubmit={this.props.onSubmit}
          attributes={this.formAttributes}
          initialValues={this.props.defaultValues}
          validationSchema={this.validationSchema}
        >
          {(formData) => (
            <div className="w-100 form-field-container products">
      				{/* Botón guardar cambios */}
        			<SaveButton
                style={{ top: "1.5%" }}
                title={this.props.saveButtonTitle}
                onSave={formData.handleSubmit}
              />

              {/* Imágenes del producto */}
              <ProductMultipleImages
                extraData={{
                  images: formData.values.images,
                  deleteImage: (imageId) => this.deleteImage(imageId, formData),
                  setImages: (newImages) => this.setImages(newImages, formData),
                  updateImage: (updatedImage) => this.updateImage(updatedImage, formData),
                }}
              />

              {/* Error en campo 'images' del formulario */}
              {Form.renderError(formData.errors.images)}

              {/* Información del producto */}
              <ProductFormFields extraData={formData} company={this.props.company} />
            </div>
          )}
        </Form>
      </Wrapper>
    );
  }
}
