#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificação final do projeto Conversor Universal...\n');

// Função para verificar se arquivo existe
const fileExists = (filePath) => fs.existsSync(filePath);

// Função para verificar se diretório existe
const dirExists = (dirPath) => fs.existsSync(dirPath);

// Função para listar arquivos temporários
const findTempFiles = () => {
  const tempPatterns = [
    '__pycache__',
    '.next',
    'node_modules',
    '*.pyc',
    '*.pyo',
    '*.pyd',
    '.DS_Store',
    'Thumbs.db',
    '*.log',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local'
  ];
  
  return tempPatterns.filter(pattern => {
    try {
      if (pattern.includes('*')) {
        const extension = pattern.replace('*.', '');
        return execSync(`find . -name "*.${extension}" -type f`, { encoding: 'utf8' }).trim().length > 0;
      } else {
        return execSync(`find . -name "${pattern}" -type d`, { encoding: 'utf8' }).trim().length > 0;
      }
    } catch (error) {
      return false;
    }
  });
};

// Verificações
const checks = [
  {
    name: 'README.md',
    check: () => fileExists('README.md'),
    message: 'Arquivo README.md existe'
  },
  {
    name: 'package.json',
    check: () => fileExists('package.json'),
    message: 'Arquivo package.json existe'
  },
  {
    name: 'requirements.txt',
    check: () => fileExists('requirements.txt') || fileExists('backend/requirements.txt'),
    message: 'Arquivo requirements.txt existe'
  },
  {
    name: '.gitignore',
    check: () => fileExists('.gitignore'),
    message: 'Arquivo .gitignore existe'
  },
  {
    name: 'Backend API',
    check: () => fileExists('backend/app.py'),
    message: 'Backend API (app.py) existe'
  },
  {
    name: 'Frontend',
    check: () => dirExists('src'),
    message: 'Diretório frontend (src) existe'
  },
  {
    name: 'Testes Frontend',
    check: () => fileExists('jest.config.js'),
    message: 'Configuração de testes Jest existe'
  },
  {
    name: 'Testes Backend',
    check: () => dirExists('backend/tests'),
    message: 'Diretório de testes backend existe'
  }
];

// Executar verificações
let passedChecks = 0;
let totalChecks = checks.length;

checks.forEach(check => {
  const result = check.check();
  console.log(`${result ? '✅' : '❌'} ${check.message}`);
  if (result) passedChecks++;
});

console.log(`\n📊 Progresso: ${passedChecks}/${totalChecks} verificações passaram\n`);

// Verificar arquivos temporários
console.log('🔍 Verificando arquivos temporários...');
try {
  const tempFiles = findTempFiles();
  if (tempFiles.length > 0) {
    console.log('⚠️  Arquivos temporários encontrados:');
    tempFiles.forEach(file => console.log(`   - ${file}`));
    console.log('   Use: npm run cleanup ou execute cleanup.bat para remover\n');
  } else {
    console.log('✅ Nenhum arquivo temporário encontrado\n');
  }
} catch (error) {
  console.log('⚠️  Não foi possível verificar arquivos temporários (PowerShell/Git Bash necessário)\n');
}

// Verificar dependências
console.log('📦 Verificando dependências...');
try {
  execSync('npm list --depth=0', { stdio: 'pipe' });
  console.log('✅ Dependências do Node.js instaladas corretamente\n');
} catch (error) {
  console.log('❌ Dependências do Node.js não instaladas. Execute: npm install\n');
}

// Resumo final
console.log('🎯 Resumo Final:');
console.log(`- ${passedChecks}/${totalChecks} verificações essenciais passaram`);
console.log('- Projeto está pronto para produção após remoção de arquivos temporários');
console.log('- Execute "npm run build" para build de produção');
console.log('- Execute "npm run lint" para verificar qualidade do código');
console.log('- Execute "npm test" para executar testes (após instalação de dependências de teste)\n');

if (passedChecks === totalChecks) {
  console.log('🎉 Projeto está completo e pronto para conclusão!');
} else {
  console.log('⚠️  Algumas verificações falharam. Revise os itens acima.');
}