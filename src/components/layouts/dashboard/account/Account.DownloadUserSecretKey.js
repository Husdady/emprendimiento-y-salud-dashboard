// React
import { Component } from "react";

// Components
import { Button } from "@common";
import WrapTitle from "@layouts/dashboard/common/Dashboard.WrapTitle";

export default class DownloadUserSecretKey extends Component {
  shouldComponentUpdate() {
    return false
  }
  
  downloadSecretKey() {
    const { userKey, username } = this.props;

    const message = `Mi clave secreta es: "${userKey}". Por favor evita compartir este clave, ya que es personal y te ayudará a poder recuperar tu correo electrónico en caso lo olvides.`

    const el = document.createElement("a");
    const newTextFile = new Blob([message], {type: 'text/plain'});
    const filename = `${username} clave secreta.txt`

    el.href = URL.createObjectURL(newTextFile);
    el.download = filename.replace(/ /g, '-');
    el.click();
  }

  render() {
    return (
      <WrapTitle icon='key' paddingY={null} title="Mi clave secreta">
        <Button
          icon="file-download"
          title="Descargar mi clave secreta"
          textColor="var(--bg-white)"
          backgroundColor="var(--bg-blue)"
          className="scale rounded py-2 px-4"
          attributes={{ title: "La clave secreta te ayudará a recuperar tu correo electrónico en caso lo olvides" }}
          onClick={this.downloadSecretKey.bind(this)}
        />
      </WrapTitle>
    );
  }
}
