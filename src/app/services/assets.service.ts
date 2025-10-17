import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AssetsService {
    constructor() {}

    private getImageAsset(imageName: string, extension: 'png' | 'svg'): string {
      return '/images/' + imageName.toLowerCase() + '.' + extension;
    }

    public getFlagImage(countryCode: string): string {
      return this.getImageAsset('flags/' + countryCode.toLowerCase(), 'svg');
    }

    public getPlateImage(countryCode: string): string {
      return this.getImageAsset('plates/' + countryCode.toLowerCase(), 'png');
    }
}