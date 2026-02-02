import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { ArticuloPlistAdminRouted } from './component/articulo/plist-admin-routed/articulo-plist';
import { NoticiaPlistAdminRouted } from './component/noticia/plist-admin-routed/noticia-plist';
import { ClubPlistAdminRouted } from './component/club/plist-admin-routed/club-plist';
import { CuotaPlistAdminRouted } from './component/cuota/plist-admin-routed/cuota-plist';
import { TipousuarioPlistAdminRouted } from './component/tipousario/plist-admin-routed/tipousuario-plist';

export const routes: Routes = [
    { path: 'tipousuario', component: TipousuarioPlistAdminRouted},
    { path: '', component: Home },
    { path: 'articulo', component: ArticuloPlistAdminRouted},
    { path: 'articulo/:tipoarticulo', component: ArticuloPlistAdminRouted},
    { path: 'noticia', component: NoticiaPlistAdminRouted},
    { path: 'noticia/:club', component: NoticiaPlistAdminRouted}
    { path: 'club/plist', component: ClubPlistAdminRouted}    
    { path: 'cuota', component: CuotaPlistAdminRouted},
    { path: 'cuota/:equipo', component: CuotaPlistAdminRouted}
];
