# Regras de Desenvolvimento

## 1. Documentos obrigatórios antes de qualquer desenvolvimento
- Ler **MASTER_REQUIREMENTS.md** antes de qualquer desenvolvimento
- Consultar **PRD.md** para escopo da versão atual
- Consultar **docs/** para especificações técnicas dos módulos (auth, perfis, parametros)

## 1.1. Skills e Agents
- Usar **skills** sempre que houver skill aplicável à tarefa
- Usar **agents/subagents** sempre que a tarefa permitir delegação paralela, investigação isolada ou divisão segura de escopo
- Ao trabalhar neste repositório, considerar obrigatório verificar primeiro se existe skill aplicável antes de implementar, analisar ou responder
- Ao dividir trabalho com agents, não sobrescrever mudanças alheias e manter escopos de edição separados

## 2. Documentação de bibliotecas — SEMPRE consultar local antes de usar
A documentação PO-UI está disponível em **C:\Ricardo\dadospublicos\docs\po-ui**.

Antes de usar qualquer componente, serviço ou ícone PO-UI:
- Consultar **C:\Ricardo\dadospublicos\docs\po-ui\docs\llms-generated\** para a API do componente
- Consultar **C:\Ricardo\dadospublicos\docs\po-ui\llms-generated\icons-animalia.md** para ícones

## 3. Versões em uso (não atualizar sem validar)
| Tecnologia | Versão |
|---|---|
| Angular | 21.2.x |
| @po-ui/ng-components | 21.x |
| @po-ui/ng-templates | 21.x |
| NestJS | 11.x |
| TypeORM | 0.3.x |
| PostgreSQL | 16 |
| Redis | 7 |
| Node.js | 20.x |

## 4. Ícones — Animalia Icons (`an an-*`)
PO-UI v21 usa **Animalia Icons** (`an an-*`). `po-icon-*` e `ph ph-*` NÃO funcionam.

```typescript
// ✅ Correto
{ icon: 'an an-plus' }
<po-button p-icon="an an-plus"></po-button>

// ❌ Errado — não renderiza
{ icon: 'po-icon-plus' }
{ icon: 'ph ph-plus' }
```

Catálogo de ícones: **C:\Ricardo\dadospublicos\docs\po-ui\llms-generated\icons-animalia.md**

## 5. Temas disponíveis
Os temas PO-UI estão em `C:\Ricardo\dadospublicos\docs\po-ui\temas\` e em `frontend/src/temas/`:
- **RCG** (`rcg-theme.ts`) — azul #4097CC + magenta #B51B7E
- **Allia** (`allia-theme.ts`) — magenta #9E1F63 + roxo #662D91 + teal #00AEA5

## 6. Escopo de desenvolvimento
- V1 = MVP em desenvolvimento (ver **PRD.md** para o que está fora)
- Leads e Atendimentos estão fora da V1
- Diretor Comercial está fora da V1

## 7. Padrão de imports PO-UI no Angular standalone
Usar `PoModule` (NgModule) nos imports do `@Component`, **não** componentes individuais:
```typescript
// ✅ Correto para standalone
imports: [PoModule, FormsModule]

// ❌ Errado — causa NG2011 no Angular 21
imports: [PoButtonComponent, PoTableComponent]
```

## 8. Angular — `ChangeDetectorRef` obrigatório em todo componente com subscribe HTTP

**TODO componente Angular** que faz chamadas HTTP e atualiza propriedades do template **DEVE** injetar `ChangeDetectorRef` e chamar `this.cdr.detectChanges()` nos callbacks.

**Por quê:** `PoPageContentComponent` (PO-UI interno) usa `setTimeout` no `ngAfterViewInit` que em certas condições aborta o ciclo de Change Detection. Dados carregados via HTTP ficam no JS state mas o DOM não atualiza — só aparece quando outro evento (ex: mover o mouse) dispara um novo ciclo.

```typescript
// ✅ Padrão obrigatório — todo componente com subscribe HTTP
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({ ... })
export class MeuComponent implements OnInit {
  dados: any[] = [];
  carregando = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,   // ← SEMPRE injetar
  ) {}

  ngOnInit() {
    this.carregando = true;
    this.http.get<any[]>('/api/dados').subscribe({
      next: (res) => {
        this.dados = res;
        this.carregando = false;
        this.cdr.detectChanges();      // ← SEMPRE chamar no next
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();      // ← SEMPRE chamar no error
      },
    });
  }
}

// ❌ Errado — dados carregam no JS mas DOM fica vazio até próxima interação
ngOnInit() {
  this.http.get<any[]>('/api/dados').subscribe({
    next: (res) => { this.dados = res; },  // sem detectChanges → bug silencioso
  });
}
```

**Checklist ao criar novo componente:**
- [ ] Importou `ChangeDetectorRef` de `@angular/core`
- [ ] Injetou `private cdr: ChangeDetectorRef` no constructor
- [ ] Chamou `this.cdr.detectChanges()` em todo `next:` que altera propriedades do template
- [ ] Chamou `this.cdr.detectChanges()` em todo `error:` que altera estado de loading/erro
- [ ] Exceção: componentes que usam **somente** `po-page-dynamic-table`/`po-page-dynamic-edit` com `p-service-api` (PO-UI gerencia internamente)

## 9. PO-UI v21 — `po-page-dynamic-edit`: campo `validate` e atualização de outros campos

**NUNCA** tente acessar o formulário interno via `(pageEdit as any).dynamicForm.form` — essa propriedade interna não é acessível no PO-UI v21.

Para preencher outros campos a partir do retorno de um `validate` (ex: CEP preenchendo endereço), usar o mecanismo oficial: retornar `fields` no objeto de resposta.

```typescript
// ✅ Correto — PO-UI v21
validarCep = (changedValue: any) => {
  return this.http.post('/validate-cep', changedValue).pipe(
    map((res: any) => ({
      value: changedValue.value,          // mantém o valor do campo atual
      fields: [                           // atualiza outros campos
        { property: 'logradouro', value: res.value.logradouro },
        { property: 'bairro',     value: res.value.bairro     },
        { property: 'uf',         value: res.value.uf         },
        { property: 'municipio',  value: res.value.municipio  },
      ].filter(f => f.value),
    })),
  );
};

// ❌ Errado — não funciona no PO-UI v21
private aplicarValoresDinamicos(value: any) {
  const ngForm = (this.pageEdit as any).dynamicForm.form; // undefined no v21
  ngForm.control.patchValue(value);                       // quebra silenciosamente
}
```

Para combos dependentes (UF → Município), chamar `mudarUf()` manualmente **antes** de retornar os `fields`, para que o `optionsService` do município seja atualizado.


