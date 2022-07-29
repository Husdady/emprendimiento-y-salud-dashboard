// React
import { Component, Fragment, createRef } from "react";

// Components
import { Button, Modal, OkButtonModal, CancelButtonModal } from "@common";
import BenefitsForm from "@layouts/form/Benefits.Form";
import DashboardModal from "@layouts/dashboard/common/Dashboard.Modal";

// Librarys
import { message } from "antd";

// Reducers
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import { isArray } from '@utils/Validations'
import { updateArrayItem, removeArrayItem } from "@utils/Helper"

export default class Benefits extends Component {
  constructor(props) {
    super(props);
    this.refModalForm = createRef();
    this.refDashboardModal = createRef();
    this.refBenefitsForm = createRef();
    this.showModalForm = this.showModalForm.bind(this);
    this.showDashboardModal = this.showDashboardModal.bind(this);
    this.onAddBenefit = this.onAddBenefit.bind(this);
    this.onEditBenefit = this.onEditBenefit.bind(this);
    this.onRemoveBenefit = this.onRemoveBenefit.bind(this);

    this.styles = {
      button: {
        height: 40,
      },
    };

    this.updateBenefit = false

    this.DashboardModalAttributes = {
      centered: true,
      cancelText: "Cerrar",
      title: "Beneficios del producto:",
      okText: <OkButtonModal icon="plus" title="Añadir beneficio" color="var(--bs-white)" />,
      onOk: () => {
        this.updateBenefit &&= false

        this.showModalForm({
          defaultValues: undefined,
          onSubmit: this.onAddBenefit,
        })
      }
    }

    this.ModalFormAttributes = {
      cancelText: <CancelButtonModal />,
      okButtonStyle: this.styles.okButtonModal,
      onOk: () => this.refBenefitsForm.current?.runValidateAllFields(),
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data !== nextProps.data
  }

  // Mostrar modal que contiene un listado de beneficios del producto
  showDashboardModal() {
    const { data } = this.props
    if (!isArray(data)) return;

    const items = data.map((benefit) => this.renderBenefit(benefit));

    this.refDashboardModal.current?.show({ items });
  }

  // Mostrar modal que contiene un formulario para añadir un beneficio
  showModalForm(extraData) {
    Object.assign(this.ModalFormAttributes, {
      okText: <OkButtonModal icon="save" title={this.updateBenefit ? 'Actualizar beneficio' : 'Guardar beneficio'} />,
    })

    this.refDashboardModal.current?.hide()
    this.refModalForm.current?.show(extraData)
  }

  // Evento 'click' en botón 'Añadir beneficio' de modal
  onAddBenefit({ values, resetForm }) {
    // Mostrar mensaje
    message.info('Se añadió un nuevo beneficio al producto', 4)

    // Datos del nuevo beneficio
    const newBenefit = { _id: new Date().getTime(), benefit: values.benefit }
    
    // Renderizar nuevo item en Modal
    const newItem = this.renderBenefit(newBenefit);

    this.props.extraData.addBenefit(newBenefit);
    this.refDashboardModal.current?.addItem(newItem);
    this.props.extraData.setFormStatus({ formHasBeenEdited: true });

    // Resetear formulario
    resetForm();

    // Ocultar modal que contiene el formulario para añadir un beneficio del producto
    this.refModalForm.current?.hide()
  }

  // Editar un beneficio de un producto
  onEditBenefit({ values }) {
    const currentBenefit = this.refModalForm.current.state?.extraData?.defaultValues?.benefit

    // Si la descripción del beneficio sigue siendo la misma
    if (values.benefit === currentBenefit) {
      return message.warning("La descripción del beneficio sigue siendo la misma, por favor actualice su información", 5)
    }

    // Datos del nuevo beneficio
    const newBenefit = { _id: new Date().getTime(), benefit: values.benefit }

    // Generar nuevo beneficio actualizado
    const updatedProductBenefit = updateArrayItem(this.props.data, {
      newData: newBenefit,
      filter: { _id: values._id },
    })

    const modalItems = this.refDashboardModal.current?.state?.items

    // Generar nuevo item actualizado
    const updatedModalItems = updateArrayItem(modalItems, {
      filter: { _id: values._id },
      newData: this.renderBenefit(newBenefit)
    });

    // Mostrar mensaje
    message.info('Se actualizó el beneficio del producto')

    this.props.extraData.setFormStatus({ formHasBeenEdited: true });
    this.refDashboardModal.current?.setState({ items: updatedModalItems });
    this.props.extraData.setFieldValue('benefits', updatedProductBenefit);
    
    // Ocultar modal que contiene el formulario
    this.refModalForm.current?.hide()
  }

  // Evento 'click' en botón 'Eliminar' de item de modal
  onRemoveBenefit(benefitId) {
    message.warn('Beneficio eliminado', 5)

    const allBenefits = removeArrayItem(this.props.data, {
      _id: benefitId,
    });

    this.props.extraData.setFieldValue('benefits', allBenefits);
    this.refDashboardModal.current?.deleteItem(benefitId);
    this.props.extraData.setFormStatus({ formHasBeenEdited: true });
  }

  // Renderizar beneficios del producto en modal
  renderBenefit(item) {
    return {
      _id: item._id,
      containerTitleStyle: {
        width: "85%",
        flexWrap: "nowrap",
        color: "var(--bg-orange)",
      },
      title: item.benefit,
      image: (
        <FontAwesomeIcon
          size="lg"
          icon="hand-sparkles"
          color="var(--bg-orange)"
        />
      ),
      icons: [
        {
          name: "edit",
          color: "var(--bg-blue)",
          onClick: () => {
            this.updateBenefit ||= true

            this.showModalForm({
              defaultValues: item,
              onSubmit: this.onEditBenefit,
            })
          }
        },
        {
          name: "trash-alt",
          className: "ms-2",
          color: "var(--bg-red)",
          onClick: () => this.onRemoveBenefit(item._id),
        },
      ],
    };
  }

  render() {
    return (
      <Fragment>
        <Button
          icon="plus"
          className="w-100 rounded"
          style={this.styles.button}
          textColor="var(--bg-gray-200)"
          backgroundColor="var(--theme-opacity-100)"
          title="Añadir nuevo beneficio del nuevo producto"
          attributes={{ type: "button" }}
          onClick={this.showDashboardModal}
        />

        {/* Modal con los beneficios del producto */}
        <DashboardModal
          ref={this.refDashboardModal}
          okButtonColor="var(--bg-darkrose)"
          attributes={this.DashboardModalAttributes}
        />

        {/* Modal que muestra el formulario para añadir un beneficio */}
        <Modal
          ref={this.refModalForm}
          okButtonColor="var(--bg-darkrose)"
          title="Nuevo beneficio del producto:"
          attributes={this.ModalFormAttributes}
        >
          {({ extraData }) => (
            <BenefitsForm refForm={this.refBenefitsForm} {...extraData} />
          )}
        </Modal>
      </Fragment>
    );
  }
}
