import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(
    id: string,
    data: Partial<User>,
  ): Promise<Omit<User, "password">> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private sanitizeUser(user: User): Omit<User, "password"> {
    const { password, ...safeUser } = user;
    void password;
    return safeUser;
  }
}
