const fs = require('fs');
const yaml = require('js-yaml');
const mustache = require('mustache');
const path = require('path');

console.log('🚀 Iniciando processamento de conexões...');

// Verificar se o template existe
const templatePath = 'templates/connection-template.mdx';
if (!fs.existsSync(templatePath)) {
  console.error('❌ Template não encontrado:', templatePath);
  process.exit(1);
}

// Ler template
const template = fs.readFileSync(templatePath, 'utf8');
console.log('✅ Template carregado');

// Configurar diretórios
const connectionsDir = 'store/connections';
const outputDir = 'connections';
const connections = [];

// Verificar se o diretório de conexões existe
if (!fs.existsSync(connectionsDir)) {
  console.error('❌ Diretório de conexões não encontrado:', connectionsDir);
  process.exit(1);
}

// Garantir que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Diretório de saída criado:', outputDir);
}

// Ler todos os arquivos YAML
const files = fs.readdirSync(connectionsDir).filter(file => file.endsWith('.yml'));
console.log(`📄 Encontrados ${files.length} arquivos YAML:`, files.map(f => f.replace('.yml', '')).join(', '));

if (files.length === 0) {
  console.log('⚠️  Nenhum arquivo YAML encontrado. Pulando processamento.');
  process.exit(0);
}

// Processar cada arquivo
files.forEach(file => {
  try {
    const filePath = path.join(connectionsDir, file);
    const yamlContent = fs.readFileSync(filePath, 'utf8');
    const connection = yaml.load(yamlContent);

    // Validar estrutura básica
    if (!connection.id || !connection.name) {
      console.warn(`⚠️  Arquivo ${file} não tem ID ou nome válidos. Pulando...`);
      return;
    }

    console.log(`🔄 Processando: ${connection.id}`);

    // Adicionar à lista de conexões
    connections.push(connection);

    // Gerar MDX usando template
    const mdxContent = mustache.render(template, connection);
    const outputFile = path.join(outputDir, `${connection.id}.mdx`);
    fs.writeFileSync(outputFile, mdxContent);

    console.log(`✅ Gerado: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Erro processando ${file}:`, error.message);
  }
});

// Atualizar JSON consolidado
const jsonOutput = {
  connections: connections.sort((a, b) => a.name.localeCompare(b.name))
};

try {
  fs.writeFileSync('store/connections.json', JSON.stringify(jsonOutput, null, 2));
  console.log('✅ Atualizado store/connections.json');
} catch (error) {
  console.error('❌ Erro ao atualizar JSON:', error.message);
  process.exit(1);
}

console.log(`\n🎉 Processamento concluído! ${connections.length} conexões processadas.`);
console.log('📋 Conexões:', connections.map(c => c.id).join(', '));
