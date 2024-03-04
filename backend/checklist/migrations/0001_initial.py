# Generated by Django 4.2.8 on 2024-01-14 11:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CheckList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='check_lists_created', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'CheckLists',
                'verbose_name_plural': 'CheckLists',
                'db_table': 'checklists',
            },
        ),
        migrations.CreateModel(
            name='CheckListRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(null=True)),
                ('finished_at', models.DateTimeField(null=True)),
                ('status', models.CharField(choices=[('STARTED', 'Started'), ('CANCELED', 'Canceled'), ('PAUSED', 'Paused'), ('PASSED', 'Passed'), ('FAILED', 'Failed')], default='STARTED', max_length=255)),
                ('duration', models.IntegerField(default=0)),
                ('check_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='runs', to='checklist.checklist')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_runs', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='updated_runs', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'CheckListRun',
                'verbose_name_plural': 'CheckListRuns',
                'db_table': 'checklist_runs',
            },
        ),
        migrations.CreateModel(
            name='CheckListRunSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True)),
                ('title', models.CharField(max_length=255)),
                ('order', models.PositiveIntegerField(default=1)),
                ('check_list_run', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='checklist.checklistrun')),
            ],
            options={
                'verbose_name': 'CheckListRunSection',
                'verbose_name_plural': 'CheckListRunSections',
                'db_table': 'checklist_run_sections',
            },
        ),
        migrations.CreateModel(
            name='CheckListRunSectionItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True)),
                ('title', models.CharField(max_length=255)),
                ('order', models.PositiveIntegerField(default=1)),
                ('status', models.CharField(choices=[('NOT_PERFORMED', 'Not Performed'), ('PASSED', 'Passed'), ('FAILED', 'Failed')], default='NOT_PERFORMED', max_length=255)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='checklist.checklistrunsection')),
            ],
            options={
                'verbose_name': 'CheckListRunSectionItem',
                'verbose_name_plural': 'CheckListRunSectionsItems',
                'db_table': 'checklist_run_sections_items',
            },
        ),
        migrations.CreateModel(
            name='CheckListSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True)),
                ('title', models.CharField(max_length=255)),
                ('order', models.PositiveIntegerField(default=1)),
                ('check_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='checklist.checklist')),
            ],
            options={
                'verbose_name': 'CheckListSection',
                'verbose_name_plural': 'CheckListSections',
                'db_table': 'checklist_sections',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=4, unique=True)),
                ('level', models.CharField(choices=[('MVP', 'Mvp'), ('ENTERPRISE', 'Enterprise')], default='MVP', max_length=255)),
            ],
            options={
                'verbose_name': 'Project',
                'verbose_name_plural': 'Projects',
                'db_table': 'projects',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CheckListSectionItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True)),
                ('title', models.CharField(max_length=255)),
                ('order', models.PositiveIntegerField(default=1)),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='checklist.checklistsection')),
            ],
            options={
                'verbose_name': 'CheckListSectionItem',
                'verbose_name_plural': 'CheckListSectionsItems',
                'db_table': 'checklist_sections_items',
            },
        ),
        migrations.CreateModel(
            name='CheckListRunSectionItemComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='checklist.checklistrunsectionitem')),
            ],
            options={
                'verbose_name': 'CheckListRunSectionItemComment',
                'verbose_name_plural': 'CheckListRunSectionsItemComments',
                'db_table': 'checklist_run_sections_item_comments',
            },
        ),
        migrations.AddField(
            model_name='checklist',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='check_lists', to='checklist.project'),
        ),
        migrations.AddField(
            model_name='checklist',
            name='updated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='check_lists_updated', to=settings.AUTH_USER_MODEL),
        ),
    ]