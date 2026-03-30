import { Subject } from 'rxjs';

export class ModalRef<TData = unknown, TResult = unknown> {
    private readonly _afterClosed = new Subject<TResult>();
    readonly afterClosed$ = this._afterClosed.asObservable();
    readonly data: TData;

    constructor(data: TData) {
        this.data = data;
    }

    close(result?: TResult): void {
        this._afterClosed.next(result as TResult);
        this._afterClosed.complete();
    }
}
