import { CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import menuConfigData from "../../../assets/data/menu-config.json";
import { GameSessionService } from "../../services/game-session.service";
import { Router } from "@angular/router";
import { LanguageService } from "../../services/language.service";
import { RedirectTransitionService } from "../../services/redirect-transition.service";

declare function main(): void; // Declare the main function from space-travel.js

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.css",
})
export class Menu implements OnInit, AfterViewChecked {
  currentRoute: string;
  menuConfig: any;
  language: string = "fr"; // default
  gameStarted: boolean = false;

  // Transition state
  isTransitioning: boolean = false;
  transitionPhase: TransitionPhase = 'idle';

  // Modal properties
  showSubmenuModal = false;
  currentSubmenuTitle = "";
  currentSubmenuText = "";
  submenuOptions: any[] = [];
  currentSubmenuData: any = null;

  private canvasInitialized = false;

  constructor(
    private gameSessionService: GameSessionService,
    private routes: Router,
    private languageService: LanguageService,
    private redirectTransitionService: RedirectTransitionService
  ) {
    this.currentRoute = window.location.pathname.split("/").slice(-1)[0] || "region";
  }

  ngOnInit() {
    this.language = this.languageService.getLanguage();
    if (this.gameSessionService.getSessionItem("gameStarted") === "true") {
      this.gameStarted = true;
    }

    this.menuConfig = menuConfigData.menus[this.currentRoute as keyof typeof menuConfigData.menus];
    if (!this.menuConfig) {
      this.menuConfig = menuConfigData.menus["region" as keyof typeof menuConfigData.menus];
    }
    
    // Backward-compatible boolean
    this.isTransitioning = this.redirectTransitionService.getTransitioning();

    // Subscribe to phase changes
    this.redirectTransitionService.getPhaseState().subscribe(phase => {
      this.transitionPhase = phase;
      this.isTransitioning = phase !== 'idle';

      // Re-init canvas each time we re-enter travel
      if (phase === 'travel') {
        this.canvasInitialized = false;
      }
    });
  }
  
  ngAfterViewChecked() {
    // Initialize canvas only during the 'travel' phase
    if (this.transitionPhase === 'travel' && !this.canvasInitialized) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        setTimeout(() => {
          try {
            main();
            this.canvasInitialized = true;
          } catch (err) {
            console.error('Error initializing canvas:', err);
          }
        });
      }
    }
  }

  handleNextMenu(menuType: string, id: string, start: boolean | null, submenu: boolean | null, route: string): void {
    if (submenu) {
      // Find the menu content with this ID
      const menuContent = this.menuConfig.content.find((item: any) => item.id === id);

      if (menuContent && menuContent.submenu_content) {
        this.currentSubmenuTitle = menuContent.name[this.language];
        this.currentSubmenuText = menuContent.subMenuText[this.language];

        const submenuContentList = menuContent.submenu_content[this.language];

        this.submenuOptions = submenuContentList.map((optionName: string, index: number) => ({
          id: menuContent.submenu_content.id[index],
          name: {
            [this.language]: optionName,
          },
          selected: false,
        }));

        this.currentSubmenuData = {
          menuType,
          id,
          start,
          route,
        };

        this.showSubmenuModal = true;
        return;
      }
    } else {
      this.redirectMenu(menuType, id, start, route);
    }
  }

  proceedWithSubmenu(): void {
    const selectedOptions = this.submenuOptions.filter((option) => option.selected).map((option) => option.id);

    if (this.currentSubmenuData) {
      const { menuType, id, route } = this.currentSubmenuData;

      if (menuType === "menu_1") {
        this.gameSessionService.setStringifiedItem("custom_regions", selectedOptions);
      } else if (menuType === "menu_2") {
        this.gameSessionService.setStringifiedItem("custom_subgamemodes", selectedOptions);
      }
      this.redirectMenu(menuType, id, this.currentSubmenuData.start, route);
    }

    this.showSubmenuModal = false;
  }

  handleBackMenu(): void {
    const previousRoute = this.menuConfig.referrer || "region";
    this.routes.navigate([`/${previousRoute}`]);
  }

  private redirectMenu(menuType: string, id: string, start: boolean | null, route: string): void {
    if (start) {
      this.gameSessionService.setSessionItem("menu_3", id);
      route = "rules";
    }
    this.gameSessionService.setSessionItem(menuType, id);

    // Use orchestrated transition (pre -> travel -> post)
    this.redirectTransitionService.redirectWithPhases(route, {
      preMs: 200,
      travelMs: 900,
      postMs: 350,
    });
  }

  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal-overlay") || (event.target as HTMLElement).classList.contains("cancel-btn")) {
      this.showSubmenuModal = false;
    }
  }

  hasSelectedOptions(): boolean {
    return this.submenuOptions.some(option => option.selected);
  }

  redirectGame(): void {
    this.routes.navigate(["/game"]);
  }

  isMenuRoot(): boolean {
    if (window.location.pathname.split("/").slice(-1)[0] === "" || window.location.pathname.split("/").slice(-1)[0] === "region") {
      return true;
    }
    return false;
  }

  toggleOption(option: any): void {
    option.selected = !option.selected;
  }
}
