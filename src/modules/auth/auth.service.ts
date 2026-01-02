/*----- libraries imports -----*/
import bcrypt from 'bcryptjs';

/*----- internal imports -----*/
import { AppDataSource } from '../../shared/config/database.js';
import { User } from '../../entities/index.js';
import { AppError } from '../../common/AppError.class.js';
import { RegisterInput, LoginInput } from '../../schemas/auth.schema.js';

/*----- utilities -----*/
import { generateToken } from '../../shared/utils/jwt.util.js';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async register({ email, password }: RegisterInput) {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) throw new AppError('El email ya está registrado', 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    const token = await generateToken({
      id: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login({ email, password }: LoginInput) {
    const user = await userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) throw new AppError('Credenciales inválidas', 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError('Credenciales inválidas', 401);

    const token = await generateToken({
      id: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async findById(id: number) {
    const user = await userRepository.findOne({ where: { id } });
    if (!user) throw new AppError('Usuario no encontrado', 404);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
