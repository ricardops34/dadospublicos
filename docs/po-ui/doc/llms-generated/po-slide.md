# PoSlideComponent

**Seletor:** `po-slide`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-slide

Componente de slide para visualização e controle de elementos de forma cíclica. Exibe um conjunto de imagens ou dados que permitem
customizar sua visualização utilizando a diretiva **[p-slide-content-template](/documentation/po-slide-content-template)**.

#### Boas práticas:
- Utilizar imagens no slide, mesmo quando possui conteúdo personalizado.
- Evitar utilizar apenas um slide isolado, utilize pelo menos dois.
- Evitar utilizar mais de 5 slides, pois a ideia do componente é destacar apenas informações importantes.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `height` | `'p-height'` | `number` | sim | `336` | Altura do po-slide, caso seja slide com template customizado, não assume o valor `default`. |
| `hideArrows` | `'p-hide-arrows'` | `boolean` | sim | `false` | Define a exibição das setas de navegação. |
| `interval` | `'p-interval'` | `number` | sim | `4000` | Valor em milissegundos que define o tempo de troca dos slides, caso o valor seja menor que `1000` os slides não trocam automaticamente. |
| `slides` | `'p-slides'` | `Array<PoSlideItem | string | any>` | não | - | Array de imagens ou dados para o slide, pode ser de três formas: |

## Métodos

### `getCurrentSlideIndex()`

Método que retorna o index do slide atual

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;
 myFunction() {
   let currentIndex = this.slideComponent.getCurrentSlideIndex();
}

```

### `next()`

Método para chamar o próximo slide.

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;

myFunction() {
 this.slideComponent.next();
}
```

### `previous()`

Método para chamar o slide anterior.

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;

myFunction() {
 this.slideComponent.previous();
}
```
