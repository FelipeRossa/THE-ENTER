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
  // Captura: (1)#?, (2)IP, (3)Host, (4)Comentário, (5)Cor
  const hostRegex = /^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)\s+#([^\s#]+)\s+##([A-Fa-f0-9]{6})$/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Grupo
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

    // Host
    const hostMatch = hostRegex.exec(line);
    if (hostMatch && currentGroup) {
      const [, hash, ip, nmHost, comentario, corHex] = hostMatch;

      const host = {
        onOff: hash !== '#', // descomentado = true
        ip: ip,
        nmHost: nmHost,
        comentario: comentario,
        corExadecimal: `#${corHex}`
      };

      currentGroup.hosts.push(host);
    }
  }

  return groups;
}


function ligarDesligarHost({ grupoTitulo, ip, nome, onOff }) {
  let content = fs.readFileSync(HOSTS_PATH, 'utf8');
  const lines = content.split('\n');

  const linhaRegex = new RegExp(`^#?\\s*${ip}\\s+${nome}\\s+#.*##[a-fA-F0-9]{6}\\r?$`, 'i');
  const grupoRegex = new RegExp(`^#?\\s*\\d{1,3}(\\.\\d{1,3}){3}\\s+${nome}\\s+#.*##[a-fA-F0-9]{6}\\r?$`, 'i');

  const updatedLines = lines.map(line => {
    // Se a linha for do mesmo host e estiver no mesmo grupo
    if (grupoRegex.test(line)) {
      if (linhaRegex.test(line)) {
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