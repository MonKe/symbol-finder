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
  DIR = path.join(__dirname, './ucd'),
  OUT = path.join(__dirname, './popup/ucd-packed.json'),
  FLAG_FLAT = process.argv.length === 3 && process.argv[2] === '--flat'

let trimmedData = []

console.log(`Reading from ${DIR}/*`)
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
              matchKeys(char, /^\-na/)
            )
          )
        )

      console.log(trimmedBlock.blk, trimmedBlock.char.length, 'chars')
      trimmedData.push(trimmedBlock)

      // when all is trimmed
      if (trimmedData.length === items.length) {
        console.log(`Writing to ${OUT}`)
        fs.writeFile(
          OUT,
          JSON.stringify(Data(trimmedData), null, 2),
          e => e ? console.error(e) : null
        )
      }
    })
  })
})

// lib

const
  Data = obj => ({data: FLAG_FLAT ? flatten(obj) : obj}),
  Block = (blk, char) => ({blk, char}),
  Char = (cp, na) => ({cp, na}),

  flatten = obj => obj.reduce((data, group) => [...data, ...group.char], []),
  matchKeys = (obj, regexp) =>
    Object.keys(obj).filter(key => regexp.test(key)).map(key => obj[key])
