// variavel para manipular arquivos no sistema
const fs = require('fs');

const HOSTS_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

function getHostsGroup() {
  try {
    // obtem o conteúdo de um arquivo
    console.log("depurando");
    const contentHosts = fs.readFileSync(HOSTS_PATH, 'utf8');
    return parseHostsContent(contentHosts);

  } catch (error) {
    return `Erro ao ler o arquivo: ${error.message}`;
  }
}

function parseHostsContent(contentHosts) {
  const lines = contentHosts.trim().split(/\r?\n/);
  const groups = [];
  let currentGroup = null;

  const groupRegex = /^#\s+\[#([\w\.\-]+)\s+#([A-Fa-f0-9]{6})\]$/;
  const hostRegex = /^(#?)\s+(\d{1,3}(?:\.\d{1,3}){3})\s+([\w\.\-]+)\s+#(\w+)\s+##([A-Fa-f0-9]{6})$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const groupMatch = groupRegex.exec(line);
    if (groupMatch) {
      const [, titulo, corHex] = groupMatch;
      currentGroup = {
        titulo,
        corExadecimal: `#${corHex}`,
        hosts: []
      };
      groups.push(currentGroup);
      continue;
    }

    const hostMatch = hostRegex.exec(line);
    if (hostMatch && currentGroup) {
      const [ , prefixo, ip, nmHost, comentario, corHex ] = hostMatch;
      const host = {
        onOff: prefixo !== '#',
        ip: ip,
        nmHost: nmHost,
        comentario: comentario,
        corExadecimal: corHex ? `#${corHex}` : '#ffffff'
      };
      currentGroup.hosts.push(host);
    }
  }

  return groups;

}

// Exporta as funções que desejar
module.exports = {
  getHostsGroup
};