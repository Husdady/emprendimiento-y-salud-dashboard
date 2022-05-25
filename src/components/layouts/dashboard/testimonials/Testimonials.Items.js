// React
import { Component } from "react";

// Components
import Items from "@layouts/dashboard/common/Dashboard.Items";

// Librarys
import { message } from "antd";
import { connect } from "react-redux";

// Actions
import getTestimonialsActions from '@redux/actions/testimonials'

// Reducers
import { getTestimonialsState } from "@redux/reducers/testimonials";

// Utils
import { convertEmptySpacesInHyphens } from '@utils/Helper'

const emptyTestimonials = require("@assets/img/testimonials/empty-testimonials.webp");

class TestimonialsItems extends Component {
  constructor(props) {
    super(props);
    this.mq = window.innerWidth <= 600;
    this.customFields = { title: "author.name", image: "author.photo.url" };

    this.emptyProps = {
      width: 400,
      height: 400,
      image: emptyTestimonials.default.src,
      title: "No existen testimonios...",
    };

    this.itemsStyles = {
      title: { width: this.mq ? "80%" : "60%", wordBreak: "initial" },
      icons: {
        edit: { color: "var(--bg-blue)" },
      },
      userIcon: {
        size: "2x",
        color: "var(--bg-gray-200)",
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.testimonials !== nextProps.testimonials ||
      this.props.loadingTestimonials !== nextProps.loadingTestimonials
    );
  }

  componentDidMount() {
    this.props.getTestimonials();
  }

  // Editar testimonio
  onEditTestimony = (testimony) => {
    // Salida: nombre%20del%20autor ===> nombre-del-autor
    const authorName = convertEmptySpacesInHyphens(testimony.author.name)

    // Navegar a un autor en especifico para editar su información
    this.props.navigateTo(`/dashboard/testimonials/author/${authorName}`);
  }

  render() {
    return (
      <Items
        empty={this.emptyProps}
        styles={this.itemsStyles}
        data={this.props.testimonials}
        customFields={this.customFields}
        loading={this.props.loadingTestimonials}
        totalItems={this.props.totalTestimonials}
        onEdit={this.onEditTestimony}
        onDelete={this.props.deleteTestimon}
      />
    );
  }
}

export default connect(getTestimonialsState, getTestimonialsActions)(TestimonialsItems)
