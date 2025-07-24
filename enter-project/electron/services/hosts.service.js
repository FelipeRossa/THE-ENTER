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
  const hostRegex = /^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)\s+#([^\s#]+)\s+##([A-Fa-f0-9]{6})$/;
  const fallbackRegex = /^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)(\s+#.*)?$/;

  // Grupo genérico para hosts fora do padrão
  let fallbackGroup = {
    titulo: 'SGD',
    corExadecimal: '#d3d3d3',
    hosts: []
  };
  let hasFallbackHosts = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Match do grupo
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

    // Match de host padrão
    const hostMatch = hostRegex.exec(line);
    if (hostMatch && currentGroup) {
      const [, hash, ip, nmHost, comentario, corHex] = hostMatch;
      const host = {
        onOff: hash !== '#',
        ip,
        nmHost,
        comentario,
        corExadecimal: `#${corHex}`
      };
      currentGroup.hosts.push(host);
      continue;
    }

    // Match de host fora do padrão (ex: localhost)
    const fallbackMatch = fallbackRegex.exec(line);
    if (fallbackMatch) {
      const [, hash, ip, nmHost] = fallbackMatch;

      const host = {
        onOff: hash !== '#',
        ip,
        nmHost,
        comentario: 'SGD',
        corExadecimal: '#d3d3d3'
      };

      fallbackGroup.hosts.push(host);
      hasFallbackHosts = true;
    }
  }

  if (hasFallbackHosts) {
    groups.push(fallbackGroup);
  }

  return groups;
}


function ligarDesligarHost({ grupoTitulo, ip, nome, onOff }) {
  let content = fs.readFileSync(HOSTS_PATH, 'utf8');
  const lines = content.split('\n');

  const linhaRegex = new RegExp(`#?\\s*${ip}\\s+${nome}\\b`, 'i');
  const grupoRegex = new RegExp(`^^#?\\s*\\d{1,3}(\\.\\d{1,3}){3}\\s+${nome}\\b`, 'i');

  const updatedLines = lines.map(line => {
    const trimmed = line.trim();

    // Se a linha for do mesmo host e estiver no mesmo grupo
    if (grupoRegex.test(trimmed)) {
      if (linhaRegex.test(trimmed)) {
        // É a linha do IP específico
        if (onOff) {
          return line.replace(/^#\s*/, ''); // Descomenta só o primeiro '# '
        } else {
          return line.startsWith('#') ? line : '# ' + line; // Já está comentado?
        }
      } else {

        // faz isso apenas quando ligar 
        if (onOff) {
          // É uma outra linha do mesmo host → desliga/comenta
          return line.startsWith('#') ? line : '# ' + line;
        } else {
          return line;
        }

      }
    }
    return line;
  });

  const update = updatedLines.join('\n');
  fs.writeFileSync(HOSTS_PATH, update, 'utf8');
}

function ligarDesligarGrupo(grupoTitulo, ativar) {
  const content = fs.readFileSync(HOSTS_PATH, 'utf8');
  const lines = content.split('\n');

  const updatedLines = [];
  let insideGroup = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // Detecta início do grupo
    if (/^#\s+\[#([\w\.\-]+)\s+#([A-Fa-f0-9]{6})\]$/.test(trimmed)) {
      const match = trimmed.match(/^#\s+\[#([\w\.\-]+)\s+#([A-Fa-f0-9]{6})\]$/);
      insideGroup = match && match[1] === grupoTitulo;
      updatedLines.push(line);
      continue;
    }

    // Se estiver dentro do grupo
    if (insideGroup) {
      // Se for linha de host com padrão ##hex
      const hostMatch = trimmed.match(/^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)\s+#([^\s#]+)\s+##([A-Fa-f0-9]{6})$/);

      if (hostMatch) {
        const isCommented = hostMatch[1] === '#';

        if (ativar && isCommented) {
          line = line.replace(/^#\s*/, ''); // descomenta
        } else if (!ativar && !isCommented) {
          line = '# ' + line; // comenta
        }

        updatedLines.push(line);
        continue;
      }
    }

    // Fora do grupo ou não linha de host → mantém
    updatedLines.push(line);
  }

  fs.writeFileSync(HOSTS_PATH, updatedLines.join('\n'), 'utf8');
}

// Exporta as funções que desejar
module.exports = {
  getHostsGroup,
  ligarDesligarHost,
  ligarDesligarGrupo
};