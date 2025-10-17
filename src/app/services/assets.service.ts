import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AssetsService {
    constructor() {}

    private getImageAsset(imageName: string): string {
      return '/images/' + imageName.toLowerCase() + '.svg';
    }

    public getFlagImage(countryCode: string): string {
      return this.getImageAsset('flags/' + countryCode.toLowerCase());
    }

    public getPlateImage(countryCode: string): string {
      return this.getImageAsset('plates/' + countryCode.toLowerCase());
    }
}