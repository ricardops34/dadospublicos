# PoPageSlideFooterComponent

**Seletor:** `po-page-slide-footer`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-slide-footer

O componente `po-page-slide-footer` pode ser utilizado para incluir os botões de ações no rodapé da [`PoPageSlide`](/documentation/po-page-slide), bem como para dar liberdade ao desenvolvedor de incluir outros itens necessários.
> Como boa prática, deve-se observar a utilização de apenas um botão primário.

```
<po-page-slide p-title="Title page-slide" #pageSlide>
 <po-page-slide-footer>
   <po-button p-label="Close" (p-click)="pageSlide.close()"> </po-button>
   <po-button p-label="Clean" (p-click)="clean()"> </po-button>
   <po-button p-label="Confirm" p-kind="primary" (p-click)="confirm()"> </po-button>
 </po-page-slide-footer>
</po-page-slide>
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `disabledAlign` | `'p-disabled-align'` | `boolean` | sim | false | Desabilita o alinhamento padrão, à direita, dos botões de ações que ficam no rodapé da [`PoPageSlide`](/documentation/po-page-slide). |
