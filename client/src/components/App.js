import ParentList from './ParentList'
import {SERVER} from '../config/global'
import { Button } from 'primereact/button'
import comp from './comp.png'


function App () {
  async function Export(){
    const response = await fetch(`${SERVER}/`)
    const data = await response.json()
    const fileName = "file";
    const json = JSON.stringify(data);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className='cv'>
      <div className='cv2'>
        <h1>Company</h1>
        <img id="i" alt="cv" src={comp}></img>
      </div>
      <ParentList>
      </ParentList>
      <Button id="export" onClick={() => Export()}><strong>Export</strong></Button>
    </div>
  )
}

export default App