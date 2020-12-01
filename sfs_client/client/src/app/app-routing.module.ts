import {RouterModule, Routes} from '@angular/router';
import {ListFilesComponent} from './files/list-files/list-files.component';
import {NgModule} from '@angular/core';
import {FileListDynamicFetcherService} from './files/services/file-list-dynamic-fetcher.service';

const appRoutes: Routes = [
  {path: '', redirectTo: '/files', pathMatch: 'full'},
  {
    path: 'files',
    component: ListFilesComponent,
    resolve: [FileListDynamicFetcherService],
    runGuardsAndResolvers: 'always'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
