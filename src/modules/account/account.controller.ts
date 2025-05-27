import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('block-account-employer/:id')
  async toggleStatusEmployer(@Param('id') id: string) {
    return this.accountService.toggleStatusEmployer(+id);
  }
}
