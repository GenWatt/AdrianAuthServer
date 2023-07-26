import fs from 'fs'

function mkdirIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

export default mkdirIfNotExists
