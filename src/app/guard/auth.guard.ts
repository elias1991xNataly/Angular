import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { LocalKeys, LocalManagerService } from "../services";
import { appRoutes } from "../app.routes";

export const authGuard: CanActivateChildFn = () => {
    const localManager = inject(LocalManagerService);
    const router = inject(Router);
    const token = localManager.getElement(LocalKeys.accessToken);

    if (token) {
        return true;
    }

    router.navigate([appRoutes.public.login], { replaceUrl: true });
    return false;
}