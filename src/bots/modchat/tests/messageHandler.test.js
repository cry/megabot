import client from '../../../client';
import { defaultStrings } from '../../../constants';
import handlePrivateMessage from '../messageHandler';
import { strings } from '../constants';
import * as utils from '../../../utils/index';

describe('handlePrivateMessage', () => {
  beforeEach(async () => {
    client.message = {
      author: {
        discriminator: 1234,
        send: jest.fn(),
        username: 'test-user'
      },
      channel: {
        send: jest.fn()
      },
      delete: jest.fn()
    };

    client.prefix = '++';
  });

  test('messages when user provides no arguments', async () => {
    client.message.content = '++mc';

    await handlePrivateMessage();

    expect(client.message.author.send).toHaveBeenCalledWith(
      strings.explanation
    );
  });

  test('messages when user does not use DMChannel', async () => {
    client.message.content = '++mc hello world';

    await handlePrivateMessage();

    expect(client.message.delete).toHaveBeenCalled();
    expect(client.message.author.send).toHaveBeenCalledWith(
      defaultStrings.dmOnly
    );
  });

  test.skip('sends success message when everything is sent', async () => {
    let modChannelMock = {
      send: jest.fn()
    };

    let successPattern = /^Your message has been forwarded to moderation team.\nIf you wish to follow up with them please reference the following id: \*\*.+\*\*$/;

    jest
      .spyOn(utils, 'getModChannel')
      .mockImplementationOnce(() => modChannelMock);

    client.message.content = '++mc hello world';

    await handlePrivateMessage();

    expect(modChannelMock.send).toHaveBeenCalled();
    expect(client.message.channel.send).toHaveBeenCalledWith(
      expect.stringMatching(successPattern)
    );
  });
});
