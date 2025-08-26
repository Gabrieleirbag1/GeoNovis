import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../types/language.type';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, QRCodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class Header {
  currentLanguage: Language;
  showQrModal = false;
  strSessionData: string = '';

  constructor(private languageService: LanguageService, private apiService: ApiService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    // Reload the page to reflect language changes
    window.location.reload();
  }

  getAllSessionStorage(): string {
    const sessionData: Record<string, string> = {};
    
    // Collect all session storage items into an object
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          sessionData[key] = value;
        }
      }
    }
    
    // console.log('Session Storage Data:', JSON.stringify(sessionData));
    this.apiService.postSession(sessionData).subscribe({
      next: (response) => {
        console.log('Session data posted successfully:', response);
      },
      error: (error) => {
        console.error('Error posting session data:', error);
      }
    });
    // Convert to JSON string
    // return '6BFR-JFC83WRWQ2-AWA9QM:4E*T*BP0R3COTCOTC$A2O8912P9286CIZK/*CDASHMBN%KHURLCMMI2T0BIFM72E4S5HED*N3YBTMLMPQ8G*CZV9WE7-6K/RBP2MN9BP.PBY982R US51S%KL7SR44VS B$CW.BRCI013VJ/DVZL1*E/0U9.S:V2ZY3T9N8UD2/CTO86-BWW3SZV5PD$5O8LDQN5/JLVHUC$7:OJKWR%NV%7GYNQXXUO:IU+PZ27B0KPJN69LF0O3H6IUFE9WX4AZ6ET6GCKN/FN$SF1NNJOS76I5AO/JK::4P6D7DU575PB4K16+Q91Q8+-G80V0/E YDI5MHSE4AM-2S/:RAIF%/M425V*V2/I1KU3DEY4W*K868U8JSJF154BE:TZGSON5ZW1LFVR26KMF3%CLAL25I9W5Q LO6DT9NV/TGOBRS4VI4HIH73BRE0QMGQ*Q8CGCV1NPECKEH:8%IPAMP159XFIHU2ED2WNLGN6X+C$GL9KL$69QD88QM2L5EPRLT6LFGESG+R8VGTO26WF7O E-OQ:GIUSA3TVRALYNAX$2VE67 1VI7U99EAF8.HH6J3PV488Z6LI/MV0MDKAZE4+B2$B9BQKH*EQLQ:FH$B9XOKY5FZ*HZS57+J+47A0A6/56-H%6LP+M0YOAMC%QQLEPISKFVQ%S8USAK7UDGAO4M95P3NDU%48+96 85KBRML:N8AI6O18Y-S/75REH:+6%JGXEVNFPS29-N6TUQJR8USA.UOU5D+69Z131WH%H1*TH+DADQV5EBH9SHWHRE2UD8D4PL:JOBUE3I5%QYAMM2QL44TH00F2%2DW.R+TVQDA-$RWD0AN302K5RNIRL.S5K7MYTK-HK%NHU*2SEOJ0R7VD.:MQ$A:+TNOFAND2MR5FU6VTOB78X2X+C/:8.BEM*N3J9-FSQ05JSQV/4E6MUD73V943P.APRTEG6R1BJ3/MWN7L:O1KCKP11*9UKCK 9SPA*I6 MCA%Q9+7D%J4*E0%0-XQP4M+GO*N6FKK. UQGPN2DR0K*DTKAL7-S91BW7UOO7ZUTISMYSFMP0MUVP5BSIPOD4NW2ZT3GI5E-1U016W6Z 3%IIJOHICJ3EI9M7K*I3%H4L4%66%P5D83I*8L7C6XMQ9F-TJCGIM-74*7RH6*5ISO3SO13A8+Y7FJO1FL2/7US91DL2SRH%7PSAY024*PELFJ6C0$1CT1X*SH6A$+3GVE1V7SZ1IJODZ5%IIOTHF%T5-OR8MB2T*UOJRTURL9.H/58S97PKLNELT+5F.D6.M8.81C5X EIRM2BH.5MHLL.FL617MRS*4LGN6Q3KP*4WNVUAM9UHNWI10R-93DGV31RM9L-N10.QHX3:066MJTI46.C7YTRVCJMH5MFFUC%TAWEIOVEB+FYV8HW415FVJP+KLO27YNTZST5HHX8J*-NQ%L6E9 0T2Q3GI5FI2Z2DDRA:GPVN3I.NGBR-*QG:SE+MQ$AKUCL-IO-8L%PSJI7YG7IJXVMPVF-+N+TLUDI*8LSRUOL6YZCT08.ML7UL0NP-F57.P2LJ%XI:6GOT91DBVKC8XCZVKRMGIF1:RA51AZKCKPJH-41:D9N7Q/CGFA G5KMVCGL3DDCSQZE4*KQW0K%0B*YE3J4ITHAEI9 8I8F /OFL9*F84R28N0R/24LICXJM35J6112U9GL$TA442W+V-$C-HSE3JGOO//AB34+8EQQGO.479H90V5%LNXFBMDT05I1TGOL:VC%66LW5-HK%NH$ 2YP4:-3VKI2C8W700 UM5NQ$G$:BYV2GVFZKDPH6:0A+%HS-G:EM-NS.E62TA1$2G:FVNK1%VC*OYYPQ.6IOHD1HIML26D:KF *E%O5UB8FXT.ZC4DLYZ7.TAKZA55BRBJ6+E RPALA YKKGJOPLE/5W-J%NLU5ARIT-QRR0BCEDH0VQPF 6KI*I.N6A/RW3GWCHE+RK.MI/C$PJ4E3KVQV5D2B6-VV2*LUYQ+5TBEAZVN SFLDL:9N8QR2MDJQB%FS+%AWM1V-U47Q/Q8I6K:V0%6BB1A62SE/FT93YQJPPNW*3I/3/2OY6S-7JI283:VSN4OGD52EX1SG%SFJT79VN%Q0CRY4FG$N2 F6N31S073'
    return ')g3r5P_I?rJ<%S#%5JWa^(;gWp9aYGIN)15q3tH%qBt5LMs4PW/sCm#Ct,\'Rj,tIeGGBl1Y/1JP>G?Z%!1T[%)(f$H^Y%cc"dd6G90_VM8-hse\'L6/QZlQkJp&A=TF4aAB2Z4RYS>P!(RKXA)$\&$o<Tnu!hk<@T^]=mMb\EkVXG1&)Kb3nV3k0Idgh6J";tGS(^2?,_LE!;sJZQhk(4K=^cI8&7Y=2(,[bc?U9&6.Zci2?#djdti0_)G.l2P:(%]=.;>26.b]a:+@O(s1s*&.6Om.6CXqU1-m#KCns]rKoD?2Z2/,8T\'Nq!X+<_tD\'nNOoZWmXf*f"*7>%0\'M--c!ROSJU^K.5Bt]ph<^Q)R3Q-@@=hI1WX;T,93lMe&SC*6e]1M9JuiQHl@Z-DTSa"4d*r9WKqF!?1!H>THb`H#39l\'pMP1NA8pJl&eZ?lhaX*-MP5nRt<]=@V:!ZP[R<g`5%!>qfSL+Q8$:lIR2+(*_U<TF#<])I6ochW$b_MW)BPN0uJn`NK<5etq.;_"\-iKM+9@PF@d)<;)=sSD-4l9:g)ld)8VC"To!&@B&Mb2PHb`\'f*8``dJ!3.NSRc18VVuoOQ\E;&qe`%G2^bStlX&d,7#I9elWoBrUJ1@:o*H$0]WA_SjI[K7kN[b9179$VUT::=*5#jchPHmQ`"1Gf2W"2QZW2dAm79(l9;l5[g?d6;_peZYF)G#HU3E8)LlGXgUJZa1+l6pCuWf!W*r69`*Ei?08aD+0_RXh(ATS`^a&8FI(aT9om:f[%b+1g/<C7qRAW$9<YjR5q@"/\)"8omURI&J+h7m/QV!%NLu_Gr6c723/&WuZ)(rh0(>e61=YV(S96)_8d%#EkKqVkG&TXEc?k7TtsgR^^LB!*$`f8#eGsdSeU.]%TG"JQ5/[=onW0r8S[k&57.W5VjNcS#g>T1]sbFS]>nZ6WQ!bVugXAVK/W7!8"mJk>;*WD*W0jT<bU;0f4,F)-SH"g-I3><Q7uc>]gHt5ZNN:Jo0p\<*]V\+mE^hPKTuLE7Kk#,PS5+"],5u,)/,K@e4&`<\'tW;o1*\j>MPW<FPF[kno"6$)0#Q+s7=1)n#V889BuqYlh0WqnV7';
  }

  openQrModal(): void {
    this.strSessionData = this.getAllSessionStorage();
    this.showQrModal = true;
  }

  closeQrModal(): void {
    this.showQrModal = false;
  }
}