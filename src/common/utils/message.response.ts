import { RequestMethod } from "@nestjs/common";

type StatusType = 'SUCCESS' | 'ERROR';

export const StatusMethod = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};


export class ApiResponseMessage {
  private messages;
  constructor() {
    this.messages = {
      [RequestMethod.GET]: {
        [StatusMethod.SUCCESS]: count =>
          count > 0 ? `${count} record${count > 1 ? 's' : ''} found.` : 'No records found.',
        [StatusMethod.ERROR]: 'Failed to retrieve data.',
      },
      [RequestMethod.POST]: {
        [StatusMethod.SUCCESS]: 'Data successfully added.',
        [StatusMethod.ERROR]: 'Failed to add data.',
      },
      [RequestMethod.PUT]: {
        [StatusMethod.SUCCESS]: 'Data successfully updated.',
        [StatusMethod.ERROR]: 'Failed to update data.',
      },
      [RequestMethod.PATCH]: {
        [StatusMethod.SUCCESS]: 'Partial data update successful.',
        [StatusMethod.ERROR]: 'Failed to partially update data.',
      },
      [RequestMethod.DELETE]: {
        [StatusMethod.SUCCESS]: 'Data successfully deleted.',
        [StatusMethod.ERROR]: 'Failed to delete data.',
      },
      [RequestMethod.OPTIONS]: {
        [StatusMethod.SUCCESS]: 'Request options successfully retrieved.',
        [StatusMethod.ERROR]: 'Failed to retrieve options.',
      },
      [RequestMethod.HEAD]: {
        [StatusMethod.SUCCESS]: 'Header metadata retrieved successfully.',
        [StatusMethod.ERROR]: 'Failed to retrieve headers.',
      },
    };
  }

  getMessage(method: RequestMethod, status: StatusType, count = 0) {
    const methodMessages = this.messages[method];
    if (!methodMessages) return 'Unsupported HTTP method.';
    const message = methodMessages[status];

    if (!message) return 'Invalid status.';
    return typeof message === 'function' ? message(count) : message;
  }
}
