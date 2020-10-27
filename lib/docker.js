const child_process = require('child_process')

const getRunningContainers = () => {
  //{{.ID}}\n{{.Image}}\n{{.Command}}\n{{.CreatedAt}}\n{{.RunningFor}}\n{{.Ports}}\n{{.Status}}\n{{.Size}}\n{{.Names}}\n{{.Labels}}\n{{.Mounts}}\n{{.Networks}}
  const fields = ['.ID','.Image','.Command','.CreatedAt','.RunningFor','.Ports','.Status','.Size','.Names','.Labels','.Mounts','.Networks']
  const formatString = fields.map((value,index)=>{
    return `{{${value}}}`
  }).join('\\n') + '\\n---'
  const cmd = `docker ps --no-trunc --format '${formatString}'`
  const results = child_process.execSync(cmd)
  const lines = results.toString().split("\n")
  // console.log(headers.split(/[  ]+?/))
  let c = 0
  const all = []
  let current = {}
  for(const [,value] of lines.entries()) {
    if(value === '---') {
      // reset
      all.push(current)
      c = 0
      current = {}
      continue
    }
    const key = fields[c]
    current[key] = value
    c++
  }
  return all
}
const renderTableForRunningContainers = (all) => {
  const output = [];

  output.push('<table class="table">')
  output.push('<thead><tr>')

  for(const [,value] of Object.keys(all[0]).entries()) {
    output.push(`<th>${value}</th>`)
  }
  output.push('</thead></tr>')

  for(const [,info] of all.entries()) {
    const execString = `docker exec -it ${info['.ID']} bash`;
    output.push('<tr>')
    for(const [key, value] of Object.entries(info)) {
      output.push(`<td>${value}</td>`)
    }
    output.push('</tr>')
    output.push(`<tr><td colspan="${Object.keys(info).length}">
      <input type="text" style="width:100%" value="${execString}" >
    </td></tr>`)
  }

  output.push('</table>')
  return output.join('')
}

module.exports = {
  getRunningContainers,
  renderTableForRunningContainers
}
