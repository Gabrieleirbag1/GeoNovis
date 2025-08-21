import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import menuConfigData from "../../../assets/data/menu-config.json";
import { GameSessionService } from "../../services/game-session.service";
import { routes } from "../../app.routes";
import { Router } from "@angular/router";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.css",
})
export class Menu implements OnInit {
  currentRoute: string;
  menuConfig: any;
  language: string = "fr"; // default
  gameStarted: boolean = false;

  // Modal properties
  showSubmenuModal = false;
  currentSubmenuTitle = "";
  currentSubmenuText = "";
  submenuOptions: any[] = [];
  currentSubmenuData: any = null;

  constructor(private gameSessionService: GameSessionService, private routes: Router, private languageService: LanguageService) {
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
  }

  handleNextMenu(menuType: string, id: string, start: boolean | null, submenu: boolean | null, route: string): void {
    if (submenu) {
      // Find the menu content with this ID
      const menuContent = this.menuConfig.content.find((item: any) => item.id === id);

      if (menuContent && menuContent.submenu_content) {
        this.currentSubmenuTitle = menuContent.name[this.language];
        this.currentSubmenuText = menuContent.subMenuText[this.language];

        // Use the predefined submenu_content from the config
        const submenuContentList = menuContent.submenu_content[this.language];

        // Convert the string array to option objects
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
        console.log("Submenu options:", this.submenuOptions);
        return;
      }
    } else {
      this.redirectMenu(menuType, id, start, route);
    }
  }

  proceedWithSubmenu(): void {
    // Get all selected options
    const selectedOptions = this.submenuOptions.filter((option) => option.selected).map((option) => option.id);

    console.log("Selected options:", selectedOptions);

    // Process the selections
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
        console.log("Starting new game or action");
        this.gameSessionService.setSessionItem("menu_3", id);
        route = "rules";
      }
      this.gameSessionService.setSessionItem(menuType, id);
      this.routes.navigate([`/${route}`]);
      
  }

  closeModal(event: MouseEvent): void {
    // Only close if clicking the overlay or cancel button
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
}
