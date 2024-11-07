export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export interface MessageView extends View {
  clearLastInfoMessage: () => void;
  displayInfoMessage: (message: string, duration: number) => void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finallyDoThis?: () => void
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (finallyDoThis) {
        finallyDoThis();
      }
    }
  }
}
