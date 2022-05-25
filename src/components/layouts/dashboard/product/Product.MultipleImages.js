// React
import { Component, Fragment, createRef } from "react";

// Components
import { Button } from "@common";

// Librarys
import { connect } from "react-redux";
import { Row, Col, message } from "antd";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reducers
import { getThemeState } from "@redux/reducers/theme";

// Utils
import nanoid from "@utils/nanoid";
import { isEmptyArray } from "@utils/Validations";
import { formatBytes, generateArray, getImageDimensions } from "@utils/Helper";

class ProductMultipleImages extends Component {
  constructor(props) {
    super(props);
    this.totalSelectImages =
      window.innerWidth > 1366
        ? 5
        : window.innerWidth <= 1366 && window.innerWidth > 768
        ? 3
        : window.innerWidth <= 768 && window.innerWidth > 540
        ? 2
        : window.innerWidth <= 540 && 1;
    this.renderProductImage = this.renderProductImage.bind(this);
    this.renderProductImages = this.renderProductImages.bind(this);
    this.renderSelectProductImage = this.renderSelectProductImage.bind(this);
    this.renderOnlySelectProductImage = this.renderOnlySelectProductImage.bind(this);
    this.renderMultipleSelectProductImage = this.renderMultipleSelectProductImage.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.extraData.images !== nextProps.extraData.images;
  }



  // Renderizar una imagen del producto
  renderProductImage(i) {
    return (
      <ProductImage
        theme={this.props.theme}
        data={this.props.extraData.images[i]}
        setImage={this.props.extraData.setImage}
        updateImage={this.props.extraData.updateImage}
        deleteImage={this.props.extraData.deleteImage}
      />
    );
  }

  // Renderizar imagenes del producto
  renderProductImages() {
    const total = this.props.extraData.images.length;
    const totalProductImages = generateArray(total);

    return (
      <Fragment>
        {totalProductImages.map((_, i) => (
          <Col
            key={i}
            xxl={{ span: 4 }}
            xl={{ span: 6 }}
            md={{ span: 7 }}
            sm={{ span: 12 }}
            xs={{ span: 17 }}
            style={{ paddingTop: 5 }}
          >
            {this.renderProductImage(i)}
          </Col>
        ))}

        {this.renderOnlySelectProductImage(total)}
      </Fragment>
    );
  }

  // Renderizar selector de imágenes del producto
  renderSelectProductImage(_, i) {
    return (
      <SelectProductImage
        key={!i ? 0 : i}
        extraData={{
          setImages: this.props.extraData.setImages,
          totalImages: this.props.extraData.images.length,
        }}
      />
    );
  }

  // Renderizar un sólo selector de imágenes del producto 
  renderOnlySelectProductImage(total) {
    if (total >= 16) return;

    return (
      <Col
        xxl={{ span: 4 }}
        xl={{ span: 6 }}
        md={{ span: 7 }}
        sm={{ span: 12 }}
        xs={{ span: 17 }}
      >
        {this.renderSelectProductImage()}
      </Col>
    )
  }

  // Renderizar múltiples selectores de imagenes del producto
  renderMultipleSelectProductImage() {
    const totalSelectImagesToRender = generateArray(this.totalSelectImages)

    return (
      <div className="d-flex flex-wrap align-items-center justify-content-center select-product-images">
        {totalSelectImagesToRender.map(this.renderSelectProductImage)}
      </div>
    );
  }

  render() {
    if (!isEmptyArray(this.props.extraData.images)) {
      return (
        <Row gutter={[20, 20]} justify="start" className="product-images">
          {this.renderProductImages()}
        </Row>
      );
    }

    return this.renderMultipleSelectProductImage();
  }
}

export default connect(getThemeState)(ProductMultipleImages);

// <------------------------ Extra Components ------------------------>
class ProductImage extends Component {
  constructor(props) {
    super(props);
    this.inputFile = createRef();
    this.updateImage = this.updateImage.bind(this);
    this.chooseImage = this.chooseImage.bind(this);

    this.styles = {
      icon: {
        width: 30,
        height: 30,
        padding: 6,
        borderRadius: "50%",
        backgroundColor: this.props.theme === "dark" ? "#c9c9c9" : "#efefef",
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data !== nextProps.data;
  }

  // Actualizar una imagen
  async updateImage(e) {
    const file = e.target.files[0];

    const imageURL = URL.createObjectURL(file);
    const productId = !this.props.data._id ? new Date().getTime() : this.props.data._id;

    const dimensions = await getImageDimensions(imageURL);

    const newImageData = {
      ...this.props.data,
      _id: productId,
      file: file,
      url: imageURL,
      size: file.size,
      format: file.type,
      filename: file.name,
      width: dimensions.width,
      height: dimensions.height,
    };

    this.props.updateImage(newImageData);

    e.target.value = "";
  }

  // Elegir una foto de perfil
  chooseImage() {
    this?.inputFile?.current?.click();
  }

  render() {
    return (
      <article className="d-flex align-items-center justify-content-center position-relative flex-column container-product-image">
        <div className="image-actions position-absolute align-items-center justify-content-between">
          {/* Botón editar */}
          <div
            style={this.styles.icon}
            onClick={this.chooseImage}
            className="d-flex align-items-center justify-content-center pointer"
          >
            <FontAwesomeIcon
              icon="edit"
              color="var(--bg-blue)"
              title="Actualizar imagen"
            />
          </div>

          {/* Botón eliminar */}
          <div
            role="button"
            style={this.styles.icon}
            className="d-flex align-items-center justify-content-center"
            onClick={() => this.props.deleteImage(this.props.data._id)}
          >
            <FontAwesomeIcon
              icon="trash-alt"
              color="var(--bg-red)"
              title="Eliminar imagen"
            />
          </div>

          {/* File */}
          <input
            type="file"
            name="image"
            className="d-none"
            ref={this.inputFile}
            accept="png, .jpg, .jpeg, .webp"
            onChange={this.updateImage}
          />
        </div>

        {/* Imagen */}
        <div
          className="image h-100"
          style={{ backgroundImage: `url(${this.props.data.url})` }}
        />

        {/* Detalles de la Imagen */}
        <div className="d-flex flex-wrap align-items-center justify-content-between image-details">
          {/* Nombre de la imagen */}
          <div className="image-name px-2">
            <FontAwesomeIcon icon={faImage} />
            <span className="ms-2 text-break">{this.props.data.filename}</span>
          </div>

          {/* Formato de la imagen */}
          <span className="image-format">Formato: {this.props.data.format}</span>

          {/* Dimensiones de la imagen */}
          <span className="image-dimensions">
            <span className="w-100 d-block">
              Dimensiones:
            </span>
            {this.props.data.width} x {this.props.data.height}
          </span>

          {/* Tamaño de imagen */}
          <span className="image-size">
            <span className="w-100 d-block">Tamaño:</span>
            <span>{formatBytes(this.props.data.size)}</span>
          </span>
        </div>
      </article>
    );
  }
}

class SelectProductImage extends Component {
  constructor(props) {
    super(props);
    this.inputFile = createRef();
    this.chooseImage = this.chooseImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);

    this.styles = {
      button: {
        title: { width: "80%", lineHeight: 1.1 },
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  // Subir imagen
  async uploadImage(e) {
    const images = [];
    const files = e.target.files;

    if (files.length > 16) {
      message.warning(
        "Se ha excedido el máximo de 16 imágenes seleccionadas",
        4
      );
      return;
    }

    if (this.props.extraData.totalImages + files.length > 16) {
      message.warning("Se ha excedido el máximo de 16 imágenes", 4);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Crear url de prueba
      const imageURL = URL.createObjectURL(file);

      // Obtener dimensiones de la imagen
      const dimensions = await getImageDimensions(imageURL);

      images.push({
        _id: new Date().getTime(),
        file: file,
        url: imageURL,
        size: file.size,
        format: file.type,
        filename: file.name,
        public_id: nanoid(),
        width: dimensions.width,
        height: dimensions.height,
      });
    }

    // Setear imágenes
    this.props.extraData.setImages(images);

    e.target.value = "";
  }

  // Elegir una foto de perfil
  chooseImage() {
    this?.inputFile?.current?.click();
  }

  render() {
    return (
      <div className="d-flex align-items-center j-center container-select-multiple-product-images">
        {/* Botón camara */}
        <label htmlFor="upload-multiple-images-dk19lo" className="d-flex align-items-center justify-content-center">
          <Button
            onClick={this.chooseImage}
            title="Selecciona una o más imagenes"
            textColor="var(--bg-gray-200)"
            backgroundColor="transparent"
            attributes={{ type: "button" }}
            titleStyle={this.styles.button.title}
            icon={{ size: "2x", name: "camera" }}
            className="d-flex align-items-center rounded p-2 flex-column"
          />
        </label>

        {/* File */}
        <input
          multiple
          type="file"
          className="d-none"
          ref={this.inputFile}
          name="multiple-image"
          onChange={this.uploadImage}
          accept="png, .jpg, .jpeg, .webp"
          id="upload-multiple-images-dk19lo"
        />
      </div>
    );
  }
}
