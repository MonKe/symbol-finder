let fs = require('fs'), path = require('path')

if (
  process.argv.length < 2 ||
  process.argv.length > 3 ||
  (process.argv.length === 3 && process.argv[2] !== '--flat')
) {
  console.error(`Usage: node ${__filename} --[flat]`)
  process.exit(-1)
}

const
  DIR = path.join(__dirname, '../ucd'),
  OUT = path.join(__dirname, '../ucd-trimmed.json'),
  FLAG_FLAT = process.argv.length === 3 && process.argv[2] === '--flat'

let trimmedData = []

fs.readdir(DIR, function(err, items) {
  items.forEach(file => {
    fs.readFile(path.join(DIR, file), "utf8", (error, data) => {
      let
        ucdBlock = JSON.parse(data),
        trimmedBlock = Block(
          ucdBlock.group['-blk'],
          ucdBlock.group.char.map(char =>
            Char(
              char['-cp'],
              Object.keys(char)
                .filter(key => /^\-na/.test(key))
                .map(key => char[key])
            )
          )
        )
      console.log(trimmedBlock.blk, trimmedBlock.char.length)
      trimmedData.push(trimmedBlock)

      // afterwards
      if (trimmedData.length === items.length) {
        if (FLAG_FLAT)
          trimmedData = trimmedData
            .reduce((data, group) => [...data, ...group.char], [])
        fs.writeFile(
          OUT,
          JSON.stringify({data: trimmedData}, null, 2),
          e => e ? console.error(e) : null
        )
      }
    })
  })
})

// lib

const Block = (blk, char) => ({blk, char})
const Char = (cp, na) => ({cp, na})
