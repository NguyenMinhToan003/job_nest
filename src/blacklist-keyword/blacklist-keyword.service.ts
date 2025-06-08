import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistKeyword } from './entities/blacklist-keyword.entity';
import * as removeAccents from 'remove-accents';

@Injectable()
export class BlacklistKeywordService {
  constructor(
    @InjectRepository(BlacklistKeyword)
    private readonly blacklistKeywordRepository: Repository<BlacklistKeyword>,
  ) {}

  async createDefaultKeywords() {
    const defaultKeywords = [
      { keyword: 'ma túy' },
      { keyword: 'mại dâm' },
      { keyword: 'bắt cóc' },
      { keyword: 'buôn người' },
      { keyword: 'hàng cấm' },
      { keyword: 'đưa người' },
      { keyword: 'gái gọi' },
      { keyword: 'tiếp khách' },
      { keyword: 'hàng nóng' },
      { keyword: 'đánh bạc' },
      { keyword: 'cờ bạc' },
      { keyword: 'lừa đảo' },
      { keyword: 'gian lận' },
      { keyword: 'hack' },
      { keyword: 'phá hoại' },
      { keyword: 'khủng bố' },
      { keyword: 'tội phạm' },
      { keyword: 'mafia' },
      { keyword: 'băng đảng' },
      { keyword: 'trộm cắp' },
      { keyword: 'cướp giật' },
      { keyword: 'đánh nhau' },
      { keyword: 'bạo lực' },
      { keyword: 'quấy rối' },
      { keyword: 'xâm hại' },
      { keyword: 'bán trẻ em' },
    ];
    return this.blacklistKeywordRepository.save(defaultKeywords);
  }

  async findAll() {
    return this.blacklistKeywordRepository.find();
  }

  async checkContentForBlacklist(content: string): Promise<boolean> {
    console.log('Checking content for blacklist keywords:', content);
    const blackListKeywords = await this.blacklistKeywordRepository.find();
    const convertedContent = removeAccents
      .remove(content.toLowerCase())
      .replace(/[^a-z0-9]/g, '');
    console.log('Converted content:', convertedContent);
    for (const keyword of blackListKeywords) {
      const convertedKeyword = removeAccents
        .remove(keyword.keyword.toLowerCase())
        .replace(/[^a-z0-9]/g, '');
      console.log('Checking against keyword:', convertedKeyword);
      if (convertedContent.includes(convertedKeyword)) {
        return true;
      }
    }
    return false;
  }
}
