import { Component } from 'react'
import Papa from 'papaparse'
import './index.css'

class FileUploader extends Component {

  state = {
    errorText: 'Please select JSON files only!',
    showError: false,
    dataFromFile: "",
    csvFile: ''
  }

  onSubmitSuccess = () => {
    alert('Successfully Submitted')
  }

  onSubmitFailure = () => {
    alert("Something went wrong. Please try again!")
  }

  onSubmitForm = (event) => {
    event.preventDefault();
    this.importCSV();

  }

  postData = async totalData => {
    const url = 'http://localhost:3000/add-more/'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(totalData),
    }
    const response = await fetch(url, options);
    if (response.ok) {
      this.onSubmitSuccess();
    }
    else {
      this.onSubmitFailure();
    }
  }

  updateData = result => {
    const { data } = result
    const csv = Papa.unparse(data, [
      {
        quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ',',
        header: true,
        newline: '\r\n',
        skipEmptyLines: false,
        columns: null,
      },
    ])
    let newStr = csv.replace(/"/g, '')
    newStr = newStr.replace(/}/g, '},')
    newStr = newStr.split(',')

    const arrVal = []

    newStr.map(each => {
      const eachVal = each.split('\r\n')
      const obj = {}
      eachVal.map(every => {
        const splitVal = every.split(':')
        if (splitVal.length === 2) {
          obj[splitVal[0].trim()] = splitVal[1].trim()
        }
        return null
      })
      arrVal.push(obj)
      return each
    })
    this.postData(arrVal)
  }

  importCSV = () => {
    const { csvFile } = this.state
    Papa.parse(csvFile, {
      complete: this.updateData,
      header: true,
    })
  }

  handleChange = event => {
    this.setState({
      csvFile: event.target.files[0],
    })
  }

  render() {
    const { showError } = this.state
    return (
      <div className="form-container">
        <form onSubmit={this.onSubmitForm} className="file-upload-form">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYdJE8PcplenlhMPSH7ip9-WPZn-1KFP1sva7lcZM5YSgaAA1ZmXV1ZyvkEW23STWWMec&usqp=CAU" alt="upload file" className="upload-file-img" />
          <h1>Upload The File</h1>
          {/* <label htmlFor="file" className="file-label">Choose a file:</label><br/>
                    <input type="file" id="file" className="file-input" name="myfile" onChange={this.checkTheFile}/>
                    <h1>Upload The File2</h1> */}
          <label htmlFor="file" className="file-label">Choose a file:</label><br />
          <input type="file" id="file" className="file-input" name="myfile" onChange={this.handleChange} />
          {showError ? <p className="error-text">please check the file you have uploaded </p> : ''}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>

    )
  }
}

export default FileUploader