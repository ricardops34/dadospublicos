import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LpAnalyticsService } from '../../../../services/lp-analytics.service';

interface Exemplo {
  linguagem: string;
  icone: string;
  codigo: string;
}

@Component({
  selector: 'app-exemplos',
  standalone: false,
  templateUrl: './exemplos.component.html',
  styleUrl: './exemplos.component.scss',
})
export class ExemplosComponent {
  abaAtiva = 0;
  docsUrl = '/docs';
  copiado = false;

  exemplos: Exemplo[] = [
    {
      linguagem: 'cURL',
      icone: 'an an-terminal',
      codigo: `curl https://api.buscadados.bjsoft.com.br/cnpj/27865757000102 \\
  -H "x_api_token: SEU_TOKEN"`,
    },
    {
      linguagem: 'Node.js',
      icone: 'an an-file-js',
      codigo: `const res = await fetch(
  'https://api.buscadados.bjsoft.com.br/cnpj/27865757000102',
  { headers: { 'x_api_token': 'SEU_TOKEN' } }
);
const empresa = await res.json();
console.log(empresa.razao_social); // GLOBO COMUNICACAO...`,
    },
    {
      linguagem: 'PHP',
      icone: 'an an-file-code',
      codigo: `$ch = curl_init('https://api.buscadados.bjsoft.com.br/cnpj/27865757000102');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['x_api_token: SEU_TOKEN']);
$data = json_decode(curl_exec($ch), true);
echo $data['razao_social']; // GLOBO COMUNICACAO...`,
    },
    {
      linguagem: 'Excel / VBA',
      icone: 'an an-table',
      codigo: `Function ConsultaCNPJ(cnpj As String) As String
  Dim url As String
  url = "https://api.buscadados.bjsoft.com.br/cnpj/" & cnpj

  With CreateObject("MSXML2.XMLHTTP")
    .Open "GET", url, False
    .setRequestHeader "x_api_token", "SEU_TOKEN"
    .send
    ConsultaCNPJ = .responseText
  End With
End Function`,
    },
    {
      linguagem: 'ADVPL (TOTVS)',
      icone: 'an an-code',
      codigo: `Local oHttp := FWRest():New("https://api.buscadados.bjsoft.com.br")
oHttp:setPath("/cnpj/27865757000102")
oHttp:addHeader("x_api_token", "SEU_TOKEN")
oHttp:Get("")
Local cResp := oHttp:GetResult()
// cResp contem o JSON com todos os dados da empresa`,
    },
  ];

  constructor(
    private router: Router,
    private analytics: LpAnalyticsService,
  ) {}

  irParaCadastro() {
    this.analytics.registrarClique('exemplos', 'cadastro');
    this.router.navigateByUrl('/cliente/cadastro');
  }

  registrarCliqueDocumentacao() {
    this.analytics.registrarClique('exemplos', 'documentacao');
  }

  selecionarAba(index: number) {
    this.abaAtiva = index;
  }

  copiar() {
    navigator.clipboard.writeText(this.exemplos[this.abaAtiva].codigo).then(() => {
      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2000);
    });
  }
}
