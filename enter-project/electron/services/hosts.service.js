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

  const groupRegex = /^#\s+\[#(.+?)\s+#([A-Fa-f0-9]{6})\]$/;
  const hostRegex = /^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)\s+#(.*?)\s+##([A-Fa-f0-9]{6})$/;
  const fallbackRegex = /^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)(?:\s+#([^#]*?))?(?:\s+##([A-Fa-f0-9]{6}))?\s*$/;

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
      const [, hash, ip, nmHost, comentario, corHex] = fallbackMatch;

      const host = {
        onOff: hash !== '#',
        ip,
        nmHost,
        comentario: comentario ? comentario : 'SGD',
        corExadecimal: corHex ? `#${corHex}` : '#d3d3d3'
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
    if (/^#\s+\[#(.+?)\s+#([A-Fa-f0-9]{6})\]$/.test(trimmed)) {
      const match = trimmed.match(/^#\s+\[#(.+?)\s+#([A-Fa-f0-9]{6})\]$/);
      insideGroup = match && match[1] === grupoTitulo;
      updatedLines.push(line);
      continue;
    }

    // Se estiver dentro do grupo
    if (insideGroup) {
      // Se for linha de host com padrão ##hex
      const hostMatch = trimmed.match(/^(#?)\s*(\d{1,3}(?:\.\d{1,3}){3})\s+([\w.\-]+)\s+#(.*?)\s+##([A-Fa-f0-9]{6})$/);

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

function salvar(grupoTitulo, hostAntigo, novoHost) {
  try {
    const fs = require('fs');
    const HOSTS_PATH = 'C:/Windows/System32/drivers/etc/hosts';

    let content = fs.readFileSync(HOSTS_PATH, 'utf8');
    let lines = content.split(/\r?\n/);

    const hostLineRegex = (ip, host) =>
      new RegExp(`^#?\\s*${ip.replace(/\./g, '\\.')}\\s+${host}(\\s+|\\s*#|$)`, 'i');

    const novaLinha = `${novoHost.onOff ? '' : '# '}${novoHost.ip} ${novoHost.nmHost} #${novoHost.comentario ?? ''} ##${(novoHost.corExadecimal || '#cccccc').replace('#', '')}`;

    // Caso seja host sem grupo definido
    if (grupoTitulo === 'SGD') {
      // Verificar duplicidade em toda a lista
      const existeDuplicado = lines.some(line => {
        const duplicadoRegex = hostLineRegex(novoHost.ip, novoHost.nmHost);
        return duplicadoRegex.test(line);
      });

      if (
        existeDuplicado &&
        (!hostAntigo || novoHost.ip !== hostAntigo.ip || novoHost.nmHost !== hostAntigo.nmHost)
      ) {
        throw `Já existe um host com IP ${novoHost.ip} e nome ${novoHost.nmHost} fora de grupo.`;
      }

      // Editar
      if (hostAntigo) {
        const regexAntigo = hostLineRegex(hostAntigo.ip, hostAntigo.nmHost);
        let linhaAlterada = false;

        for (let i = 0; i < lines.length; i++) {
          if (regexAntigo.test(lines[i])) {
            lines[i] = novaLinha;
            linhaAlterada = true;
            break;
          }
        }

        if (!linhaAlterada) throw 'Host antigo não encontrado fora de grupo.';
      } else {
        // Adicionar ao final do arquivo
        lines.push(novaLinha);
      }

      fs.writeFileSync(HOSTS_PATH, lines.join('\n'), 'utf8');
      return true;
    }

    // -------------------
    // Caso com grupo definido
    // -------------------
    const grupoRegex = new RegExp(`^#\\s+\\[#${grupoTitulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+#([A-Fa-f0-9]{6})\\]$`);
    let inGrupo = false;
    let grupoInicioIdx = -1;
    let grupoFimIdx = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (grupoRegex.test(line)) {
        inGrupo = true;
        grupoInicioIdx = i;
        grupoFimIdx = i;
        continue;
      }

      if (inGrupo) {
        if (/^#\s+\[#.+\s+#([A-Fa-f0-9]{6})\]$/.test(line)) break;
        grupoFimIdx = i;
      }
    }

    if (grupoInicioIdx === -1) {
      throw `Grupo '${grupoTitulo}' não encontrado`;
    }

    const existeDuplicado = lines
      .slice(grupoInicioIdx + 1, grupoFimIdx + 1)
      .some(line => {
        const duplicadoRegex = hostLineRegex(novoHost.ip, novoHost.nmHost);
        return duplicadoRegex.test(line);
      });

    if (existeDuplicado && (!hostAntigo || (novoHost.ip !== hostAntigo.ip || novoHost.nmHost !== hostAntigo.nmHost))) {
      throw 'Já existe um host com esse IP e nome neste grupo';
    }

    if (hostAntigo) {
      const regexAntigo = hostLineRegex(hostAntigo.ip, hostAntigo.nmHost);
      let linhaEncontrada = false;

      for (let i = grupoInicioIdx + 1; i <= grupoFimIdx; i++) {
        if (regexAntigo.test(lines[i])) {
          lines[i] = novaLinha;
          linhaEncontrada = true;
          break;
        }
      }

      if (!linhaEncontrada) {
        throw 'Host antigo não encontrado no grupo';
      }
    } else {
      lines.splice(grupoFimIdx + 1, 0, novaLinha);
    }

    fs.writeFileSync(HOSTS_PATH, lines.join('\n'), 'utf8');
    return true;
  } catch (err) {
    console.error(err);
    throw err.toString();
  }
}

function salvarGrupo(grupoAntigo, grupoNovo) {
  let content = fs.readFileSync(HOSTS_PATH, 'utf8');

  const lines = content.split(/\r?\n/);

  // valida duplicidade
  validarGrupoUnico(grupoNovo.titulo, grupoAntigo?.titulo);

  const novaLinhaGrupo = `# [#${grupoNovo.titulo} ${grupoNovo.corExadecimal}]`;

  const groupRegexAntigo = grupoAntigo
    ? new RegExp(`^#\\s+\\[#${grupoAntigo.titulo}\\s+#([A-Fa-f0-9]{6})\\]$`, 'i')
    : null;
  let grupoEditado = false;
  const updatedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (groupRegexAntigo && groupRegexAntigo.test(line)) {
      // Se for edição → substitui a linha
      updatedLines.push(novaLinhaGrupo);
      grupoEditado = true;
      continue;
    }

    updatedLines.push(line);
  }

  // Se não for edição → adiciona no final
  if (!grupoEditado && !grupoAntigo) {
    updatedLines.push('');
    updatedLines.push(novaLinhaGrupo);
  }

  fs.writeFileSync(HOSTS_PATH, updatedLines.join('\n'), 'utf8');

}

function validarGrupoUnico(grupoTitulo, tituloGgrupoAntigo = null) {
  const content = fs.readFileSync(HOSTS_PATH, 'utf8');
  const lines = content.split(/\r?\n/);

  const groupRegex = new RegExp(`^#\\s+\\[#${grupoTitulo}\\s+#([A-Fa-f0-9]{6})\\]$`, 'i');

  let ocorrencias = 0;

  for (const line of lines) {
    if (groupRegex.test(line)) {
      // Se for edição, desconsiderar o grupo que será substituído
      if (
        tituloGgrupoAntigo &&
        new RegExp(`^#\\s+\\[#${tituloGgrupoAntigo}\\s+#([A-Fa-f0-9]{6})\\]$`, 'i').test(line)
      ) {
        continue;
      }
      ocorrencias++;
    }
  }

  if (ocorrencias > 0) {
    throw new Error(`Mais de um grupo já cadastrado com o nome "${grupoTitulo}"`);
  }
}


function excluirHost(grupoTitulo, hostParaExcluir) {
  try {
    const content = fs.readFileSync(HOSTS_PATH, 'utf8');
    const lines = content.split(/\r?\n/);

    const novaLista = [];
    let inGrupo = false;

    const grupoRegex = new RegExp(`^#\\s+\\[#${grupoTitulo}\\s+#([A-Fa-f0-9]{6})\\]$`);
    const hostRegex = new RegExp(
      `^#?\\s*${escapeReg(hostParaExcluir.ip)}\\s+${escapeReg(hostParaExcluir.nmHost)}(\\s+#.*)?(\\s+##[A-Fa-f0-9]{6})?$`,
      'i'
    );

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (grupoTitulo === 'SGD') {
        // Sem grupo definido, apenas remove linha correspondente
        if (!hostRegex.test(line)) {
          novaLista.push(line);
        }
        continue;
      }

      // Grupo definido
      if (grupoRegex.test(line)) {
        inGrupo = true;
        novaLista.push(line);
        continue;
      }

      // Sai do grupo ao encontrar outro grupo
      if (inGrupo && /^#\s+\[#.+\s+#([A-Fa-f0-9]{6})\]$/.test(line)) {
        inGrupo = false;
        novaLista.push(line);
        continue;
      }

      if (inGrupo) {
        // Estamos dentro do grupo correto
        if (!hostRegex.test(line)) {
          novaLista.push(line);
        }
        continue;
      }

      // Fora de qualquer grupo
      novaLista.push(line);
    }

    fs.writeFileSync(HOSTS_PATH, novaLista.join('\n'), 'utf8');
    return true;
  } catch (err) {
    console.error(err);
    throw err.toString();
  }
}

// Escape de pontos e hífens para regex
function escapeReg(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function excluirGrupo(grupo) {
  try {
    const content = fs.readFileSync(HOSTS_PATH, 'utf8');
    const lines = content.split(/\r?\n/);

    const grupoRegex = new RegExp(`^#\\s+\\[#${grupo.titulo}\\s+#([A-Fa-f0-9]{6})\\]$`);
    const novaLista = [];
    let inGrupo = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (grupoRegex.test(line)) {
        inGrupo = true; // Início do grupo
        continue; // Pula a linha do grupo
      }

      if (inGrupo && /^#\s+\[#.+\s+#([A-Fa-f0-9]{6})\]$/.test(line)) {
        inGrupo = false; // Fim do grupo
        continue; // Pula a linha do próximo grupo
      }

      if (!inGrupo) {
        novaLista.push(line); // Mantém linhas fora do grupo
      }
    }

    fs.writeFileSync(HOSTS_PATH, novaLista.join('\n'), 'utf8');
    return true;
  } catch (err) {
    console.error(err);
    throw err.toString();
  }
}

// Exporta as funções que desejar
module.exports = {
  getHostsGroup,
  ligarDesligarHost,
  ligarDesligarGrupo,
  salvar,
  salvarGrupo,
  excluirHost,
  excluirGrupo
};