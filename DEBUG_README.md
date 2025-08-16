# 🔧 Script de Setup com Debug Avançado

## 📋 Visão Geral

O script `activate.bat` foi aprimorado com recursos avançados de debug e monitoramento para facilitar a depuração e acompanhamento do processo de instalação.

## 🚀 Recursos Implementados

### 1. **Sistema de Logging Detalhado**
- **Arquivo de Log**: `setup_debug.log`
- **Timestamps**: Registro de data/hora para cada operação
- **Códigos de Resultado**: Captura de `errorlevel` para cada comando
- **Rastreamento de Comandos**: Log de todos os comandos executados

### 2. **Pausas Estratégicas**
- **Entre Etapas**: Pausas para análise visual do progresso
- **Após Verificações**: Confirmação de cada ferramenta verificada
- **Controle Manual**: Usuário controla o ritmo de execução

### 3. **Modo Debug Visual**
- **Cores Diferenciadas**: Mensagens de debug em cores específicas
- **Indicadores de Progresso**: Status visual de cada etapa
- **Informações Contextuais**: Detalhes sobre comandos e resultados

### 4. **Configuração Flexível**
```batch
set DEBUG_MODE=1          # 1=ativo, 0=desativo
set LOG_FILE=setup_debug.log
set PAUSE_BETWEEN_STEPS=1 # 1=com pausas, 0=sem pausas
```

## 📊 Estrutura do Log

### Formato das Entradas
```
[DEBUG] Timestamp: HH:MM:SS
[DEBUG] Executando: comando_executado
[DEBUG] Resultado: codigo_de_saida
[DEBUG] Status: SUCESSO/ERRO/AVISO
```

### Seções do Log
1. **Inicialização**: Data, hora, diretório atual
2. **Etapa 1**: Verificação de ferramentas (winget, Python, Node.js, npm)
3. **Etapa 2**: Configuração do Python e dependências
4. **Etapa 3**: Configuração do frontend
5. **Finalização**: Resumo e conclusão

## 🎯 Pontos de Pausa Estratégicos

### Pausa 1: Antes da Verificação
- **Momento**: Após exibição do banner
- **Propósito**: Preparação para verificação de ferramentas

### Pausa 2: Após Cada Ferramenta
- **Momento**: Após verificação de winget, Python, Node.js
- **Propósito**: Análise individual de cada resultado

### Pausa 3: Entre Etapas Principais
- **Momento**: Entre verificação, configuração Python e frontend
- **Propósito**: Revisão de progresso e preparação para próxima fase

### Pausa 4: Antes da Finalização
- **Momento**: Após configuração completa
- **Propósito**: Verificação final antes da conclusão

## 🔍 Informações de Debug Capturadas

### Para Cada Comando:
- ✅ **Comando Executado**: Texto completo do comando
- ✅ **Código de Saída**: `errorlevel` retornado
- ✅ **Timestamp**: Momento exato da execução
- ✅ **Contexto**: Etapa e propósito da execução

### Para Cada Etapa:
- 📝 **Início**: Timestamp de início da etapa
- 📝 **Progresso**: Status de cada sub-operação
- 📝 **Resultado**: Sucesso ou falha da etapa
- 📝 **Fim**: Timestamp de conclusão

## 🛠️ Como Usar

### Execução Normal com Debug
```cmd
activate.bat
```

### Personalização do Debug
1. **Editar Variáveis** no início do script:
   ```batch
   set DEBUG_MODE=1          # Ativar/desativar debug
   set LOG_FILE=meu_log.log  # Nome personalizado do log
   set PAUSE_BETWEEN_STEPS=0 # Desativar pausas
   ```

2. **Executar** o script normalmente

### Análise do Log
```cmd
type setup_debug.log
# ou
notepad setup_debug.log
```

## 📈 Benefícios para Depuração

### 1. **Identificação Rápida de Problemas**
- Localização exata onde o script falha
- Códigos de erro específicos para cada comando
- Contexto completo da falha

### 2. **Análise de Performance**
- Timestamps para medir duração de cada etapa
- Identificação de gargalos no processo
- Otimização baseada em dados reais

### 3. **Troubleshooting Avançado**
- Histórico completo de execução
- Reprodução de problemas com dados precisos
- Suporte técnico com informações detalhadas

### 4. **Validação de Ambiente**
- Verificação de pré-requisitos
- Confirmação de instalações
- Detecção de conflitos de versão

## 🎨 Códigos de Cores

- 🟢 **Verde (0A)**: Sucesso
- 🔴 **Vermelho (0C)**: Erro
- 🟡 **Amarelo (0E)**: Aviso/Progresso
- 🔵 **Azul (0B)**: Informação
- 🟣 **Magenta (0D)**: Debug/Pausa
- ⚪ **Branco (07)**: Texto normal

## 📋 Checklist de Verificação

### Antes da Execução:
- [ ] Verificar se `DEBUG_MODE=1`
- [ ] Confirmar permissões de escrita no diretório
- [ ] Limpar logs anteriores se necessário

### Durante a Execução:
- [ ] Observar mensagens de debug
- [ ] Verificar pausas estratégicas
- [ ] Monitorar códigos de resultado

### Após a Execução:
- [ ] Revisar arquivo de log
- [ ] Verificar se todas as etapas foram concluídas
- [ ] Analisar possíveis warnings ou erros

## 🔧 Solução de Problemas Comuns

### Log não é criado
- Verificar permissões de escrita
- Confirmar se `DEBUG_MODE=1`
- Executar como administrador se necessário

### Pausas não funcionam
- Verificar se `PAUSE_BETWEEN_STEPS=1`
- Confirmar que o terminal suporta `pause`

### Cores não aparecem
- Verificar se o terminal suporta cores ANSI
- Usar terminal nativo do Windows

## 📞 Suporte

Para problemas específicos:
1. Execute o script com debug ativo
2. Colete o arquivo `setup_debug.log`
3. Identifique a linha exata do erro
4. Verifique os códigos de resultado
5. Consulte a documentação das ferramentas específicas

---

**Nota**: Este sistema de debug foi projetado para ser não-intrusivo e pode ser facilmente desativado definindo `DEBUG_MODE=0` e `PAUSE_BETWEEN_STEPS=0`.