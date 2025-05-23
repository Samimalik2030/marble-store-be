import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.mongo';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Project.name,
    schema:ProjectSchema
  }])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports:[ProjectService]
})
export class ProjectModule {}
